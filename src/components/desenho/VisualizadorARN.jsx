import { useState, useRef, useEffect, useCallback } from "react";
import { Layer, Circle, Text, Line, Group, Rect } from "react-konva";
import Konva from "konva";
import { inserirRn, removerRn, listarRn } from "../../services/rnServices";
import PalcoZoom from "./PalcoZoom";

const RAIO            = 26;
const ESPACO_VERTICAL = 82;
const MARGEM          = 50;
const DURACAO_ANIM    = 0.75; // mais lento para o usuário aprender

// ─── Constrói árvore encadeada a partir do array plano ──────────────────────
function construirArvore(arr) {
  if (!arr || arr.length === 0) return null;
  const mapa = {};
  arr.forEach((no) => { mapa[no.valor] = no; });
  const filhos = new Set();
  arr.forEach((no) => {
    if (no.esq !== null) filhos.add(no.esq);
    if (no.dir !== null) filhos.add(no.dir);
  });
  let raizValor = null;
  for (const no of arr) {
    if (!filhos.has(no.valor)) { raizValor = no.valor; break; }
  }
  if (raizValor === null) return null;

  function montar(valor) {
    if (valor === null || mapa[valor] === undefined) return null;
    const no = mapa[valor];
    return { valor: no.valor, cor: no.cor, esq: montar(no.esq), dir: montar(no.dir) };
  }
  return montar(raizValor);
}

// ─── Utilitários de layout ───────────────────────────────────────────────────
function profundidade(no) {
  if (!no) return 0;
  return 1 + Math.max(profundidade(no.esq), profundidade(no.dir));
}

function calcPosicoes(no, prof, esq, dir, larguraDesenho, acc = {}) {
  if (!no) return acc;
  acc[no.valor] = {
    x: MARGEM + ((esq + dir) / 2) * (larguraDesenho - MARGEM * 2),
    y: 60 + prof * ESPACO_VERTICAL,
  };
  calcPosicoes(no.esq, prof + 1, esq, (esq + dir) / 2, larguraDesenho, acc);
  calcPosicoes(no.dir, prof + 1, (esq + dir) / 2, dir, larguraDesenho, acc);
  return acc;
}

function calcArestas(no, acc = []) {
  if (!no) return acc;
  if (no.esq) { acc.push({ pai: no.valor, filho: no.esq.valor, corFilho: no.esq.cor }); calcArestas(no.esq, acc); }
  if (no.dir) { acc.push({ pai: no.valor, filho: no.dir.valor, corFilho: no.dir.cor }); calcArestas(no.dir, acc); }
  return acc;
}

function extrairNos(no, lista = []) {
  if (!no) return lista;
  lista.push({ valor: no.valor, cor: no.cor });
  extrairNos(no.esq, lista);
  extrairNos(no.dir, lista);
  return lista;
}

function alturaNegra(no) {
  if (!no) return 0;
  return (no.cor === "Negro" ? 1 : 0) + alturaNegra(no.esq);
}

// ─── Aresta animada (mesma lógica da AVL) ───────────────────────────────────
function ArestaRN({ posAlvoPai, posAlvoFilho, corFilho }) {
  const ref       = useRef();
  const prevPai   = useRef(posAlvoPai);
  const prevFilho = useRef(posAlvoFilho);
  const corLinha  = corFilho === "Rubro" ? "#f87171" : "#64748b";

  useEffect(() => {
    if (!ref.current) return;
    ref.current.points([posAlvoPai.x, posAlvoPai.y, posAlvoFilho.x, posAlvoFilho.y]);
    prevPai.current   = posAlvoPai;
    prevFilho.current = posAlvoFilho;
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const startP = { ...prevPai.current };
    const startF = { ...prevFilho.current };
    const endP   = posAlvoPai;
    const endF   = posAlvoFilho;

    const moved = Math.abs(endP.x - startP.x) > 0.5 || Math.abs(endP.y - startP.y) > 0.5 ||
                  Math.abs(endF.x - startF.x) > 0.5 || Math.abs(endF.y - startF.y) > 0.5;
    if (!moved) return;

    const startTime = performance.now();
    const dur       = DURACAO_ANIM * 1000;

    const tick = (now) => {
      const t    = Math.min((now - startTime) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      if (!ref.current) return;
      ref.current.points([
        startP.x + (endP.x - startP.x) * ease,
        startP.y + (endP.y - startP.y) * ease,
        startF.x + (endF.x - startF.x) * ease,
        startF.y + (endF.y - startF.y) * ease,
      ]);
      ref.current.getLayer()?.batchDraw();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    prevPai.current   = posAlvoPai;
    prevFilho.current = posAlvoFilho;
  }, [posAlvoPai.x, posAlvoPai.y, posAlvoFilho.x, posAlvoFilho.y]);

  return (
    <Line ref={ref}
      points={[posAlvoPai.x, posAlvoPai.y, posAlvoFilho.x, posAlvoFilho.y]}
      stroke={corLinha} strokeWidth={1.5} />
  );
}

// ─── Nó Rubro-Negro animado ──────────────────────────────────────────────────
function NoRN({ valor, cor, posAlvo, estado, destacado, aoPassar, aoSair }) {
  const ref     = useRef();
  const prevPos = useRef(posAlvo);
  const ehRubro  = cor === "Rubro";
  const corFundo = ehRubro ? "#dc2626" : "#1e293b";
  const corBorda = ehRubro ? "#991b1b" : "#0f172a";
  const corBrilho = ehRubro ? "#f87171" : "#64748b";

  // Montagem inicial
  useEffect(() => {
    if (!ref.current) return;
    if (estado === "novo") {
      ref.current.x(posAlvo.x);
      ref.current.y(posAlvo.y);
      ref.current.scaleX(0);
      ref.current.scaleY(0);
      ref.current.opacity(0);
      new Konva.Tween({
        node: ref.current,
        duration: DURACAO_ANIM,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        easing: Konva.Easings.EaseOut,
      }).play();
    } else {
      ref.current.x(posAlvo.x);
      ref.current.y(posAlvo.y);
    }
    prevPos.current = posAlvo;
  }, []);

  // Remoção
  useEffect(() => {
    if (!ref.current || estado !== "removendo") return;
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      scaleX: 0,
      scaleY: 0,
      opacity: 0,
      easing: Konva.Easings.EaseInOut,
    }).play();
  }, [estado]);

  // Movimento / rotação
  useEffect(() => {
    if (!ref.current || estado === "novo" || estado === "removendo") return;
    const dx = posAlvo.x - prevPos.current.x;
    const dy = posAlvo.y - prevPos.current.y;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      new Konva.Tween({
        node: ref.current,
        duration: DURACAO_ANIM,
        x: posAlvo.x,
        y: posAlvo.y,
        easing: Konva.Easings.EaseInOut,
      }).play();
    }
    prevPos.current = posAlvo;
  }, [posAlvo.x, posAlvo.y, estado]);

  return (
    <Group ref={ref} onMouseEnter={aoPassar} onMouseLeave={aoSair}>
      {destacado && (
        <Circle radius={RAIO + 5} fill="transparent" stroke={corBrilho}
          strokeWidth={1.5} opacity={0.4}
          shadowColor={corBrilho} shadowBlur={18} shadowOpacity={0.6} />
      )}
      <Circle radius={RAIO}
        fill={destacado ? (ehRubro ? "#fecaca" : "#334155") : corFundo}
        stroke={destacado ? corBrilho : corBorda}
        strokeWidth={destacado ? 2 : 1.8} />
      <Text x={-RAIO} y={-RAIO} width={RAIO * 2} height={RAIO * 2}
        text={String(valor)} fontSize={13} fontFamily="monospace" fontStyle="bold"
        fill={destacado ? (ehRubro ? "#991b1b" : "#e2e8f0") : "#ffffff"}
        align="center" verticalAlign="middle" />
      <Rect x={RAIO - 8} y={-RAIO - 15} width={28} height={14} cornerRadius={3}
        fill={ehRubro ? "#fef2f2" : "#f1f5f9"}
        stroke={ehRubro ? "#f87171" : "#64748b"} strokeWidth={1} />
      <Text x={RAIO - 8} y={-RAIO - 15} width={28} height={14}
        text={ehRubro ? "R" : "N"}
        fontSize={8} fontFamily="monospace" fontStyle="bold"
        fill={ehRubro ? "#dc2626" : "#1e293b"}
        align="center" verticalAlign="middle" />
    </Group>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function RubroNegraVisualizer({ onAcoes }) {
  const [arvore, setArvore]         = useState(null);
  const [nosMap, setNosMap]         = useState({});
  const [arestas, setArestas]       = useState([]);
  const [mensagem, setMensagem]     = useState(null);
  const [valorSobre, setValorSobre] = useState(null);
  const refContainer                = useRef(null);
  const [largura, setLargura]       = useState(600);
  const [altura, setAltura]         = useState(500);
  const animandoRef                 = useRef(false);

  const calcLarguraDesenho = useCallback((arv, larg) => {
    const prof       = profundidade(arv);
    const maxNosBase = Math.pow(2, Math.max(0, prof - 1));
    const minEspaco  = maxNosBase * (RAIO * 3);
    return Math.max(larg, minEspaco);
  }, []);

  const load = useCallback(async () => {
    if (animandoRef.current) return;
    try {
      const r = await listarRn();
      setArvore(construirArvore(r.data));
    } catch { setArvore(null); }
  }, []);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    const atualizar = () => {
      if (refContainer.current) {
        setLargura(refContainer.current.offsetWidth);
        setAltura(refContainer.current.offsetHeight);
      }
    };
    atualizar();
    const obs = new ResizeObserver(atualizar);
    if (refContainer.current) obs.observe(refContainer.current);
    return () => obs.disconnect();
  }, []);

  // Recalcula mapa ao mudar árvore
  useEffect(() => {
    const larguraDesenho = calcLarguraDesenho(arvore, largura);
    const novasPosicoes  = arvore ? calcPosicoes(arvore, 0, 0, 1, larguraDesenho) : {};
    const novosNos       = arvore ? extrairNos(arvore) : [];
    const novasArestas   = arvore ? calcArestas(arvore) : [];

    const novosValores   = new Set(novosNos.map((n) => n.valor));
    const antigosValores = new Set(Object.keys(nosMap).map(Number));

    const inseridos = [...novosValores].filter((v) => !antigosValores.has(v));
    const removidos = [...antigosValores].filter((v) => !novosValores.has(v));

    if (removidos.length) {
      animandoRef.current = true;
      setNosMap((prev) => {
        const next = { ...prev };
        removidos.forEach((v) => {
          if (next[v]) next[v] = { ...next[v], estado: "removendo" };
        });
        return next;
      });
      setTimeout(() => {
        animandoRef.current = false;
        const mapaFinal = {};
        novosNos.forEach((n) => {
          mapaFinal[n.valor] = {
            valor: n.valor,
            cor: n.cor,
            posAlvo: novasPosicoes[n.valor] || { x: 0, y: 0 },
            estado: "normal",
          };
        });
        setNosMap(mapaFinal);
        setArestas(novasArestas);
      }, DURACAO_ANIM * 1000 + 50);
    } else {
      setNosMap((prev) => {
        const next = {};
        novosNos.forEach((n) => {
          next[n.valor] = {
            valor: n.valor,
            cor: n.cor,
            posAlvo: novasPosicoes[n.valor] || { x: 0, y: 0 },
            estado: inseridos.includes(n.valor) ? "novo" : "normal",
          };
        });
        return next;
      });
      setArestas(novasArestas);
    }

    if (inseridos.length) {
      setTimeout(() => {
        setNosMap((prev) => {
          const next = { ...prev };
          inseridos.forEach((v) => {
            if (next[v]) next[v] = { ...next[v], estado: "normal" };
          });
          return next;
        });
      }, DURACAO_ANIM * 1000 + 50);
    }
  }, [arvore, largura]);

  const avisar = (texto, cor = "#00e676") => {
    setMensagem({ texto, cor });
    setTimeout(() => setMensagem(null), 2500);
  };

  useEffect(() => {
    onAcoes?.({
      inserir: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar("Valor inválido!", "#ff4466");
        try { await inserirRn(val); setTimeout(() => load(), 300); avisar(`Inserido ${val}`); }
        catch { avisar("Erro ao inserir!", "#ff4466"); }
      },
      remover: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar("Valor inválido!", "#ff4466");
        try { await removerRn(val); setTimeout(() => load(), 300); avisar(`Removido ${val}`); }
        catch { avisar("Erro ao remover!", "#ff4466"); }
      },
    });
  }, [onAcoes]);

  const prof     = profundidade(arvore);
  const nosLista = Object.values(nosMap);
  const negros   = alturaNegra(arvore);

  return (
    <div ref={refContainer} className="relative w-full h-full">
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none">
          {mensagem.texto}
        </div>
      )}

      <div className="absolute top-3 left-4 flex gap-3 text-[10px] font-mono items-center flex-wrap text-green-600 pointer-events-none z-10 font-semibold">
        <span>profundidade: <b>{prof}</b></span>
        <span>nós: <b>{nosLista.filter(n => n.estado !== "removendo").length}</b></span>
        <span>alt.&nbsp;negra: <b>{negros}</b></span>
        <span className="font-bold">
          {arvore?.cor === "Negro" || !arvore ? "✓ raiz negra" : "⚠ raiz rubro"}
        </span>
        <span style={{ color: "#dc2626" }}>● Rubro</span>
        <span style={{ color: "#1e293b" }}>● Negro</span>
      </div>

      <PalcoZoom width={largura} height={altura}>
        <Layer>
          <Rect x={-5000} y={-5000} width={largura + 10000} height={altura + 10000} fill="#ffffff" />

          {/* Arestas animadas */}
          {arestas.map((e) => {
            const posPai   = nosMap[e.pai]?.posAlvo;
            const posFilho = nosMap[e.filho]?.posAlvo;
            if (!posPai || !posFilho) return null;
            return (
              <ArestaRN key={`${e.pai}-${e.filho}`}
                posAlvoPai={posPai}
                posAlvoFilho={posFilho}
                corFilho={e.corFilho} />
            );
          })}

          {/* Nós animados */}
          {nosLista.map((n) => (
            <NoRN key={n.valor}
              valor={n.valor}
              cor={n.cor}
              posAlvo={n.posAlvo}
              estado={n.estado}
              destacado={valorSobre === n.valor}
              aoPassar={() => setValorSobre(n.valor)}
              aoSair={() => setValorSobre(null)} />
          ))}

          {!arvore && nosLista.length === 0 && (
            <Text x={0} y={altura / 2 - 10} width={largura}
              text="Árvore Rubro‑Negra vazia — use o painel para inserir"
              fontSize={12} fontFamily="monospace" fill="#334155" align="center" />
          )}
        </Layer>
      </PalcoZoom>
    </div>
  );
}