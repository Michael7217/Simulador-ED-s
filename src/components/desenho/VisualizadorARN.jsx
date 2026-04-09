import { useState, useRef, useEffect } from "react";
import { Layer, Circle, Text, Line, Group, Rect } from "react-konva";
import { inserirRn, removerRn, listarRn } from "../../services/rnServices";
import PalcoZoom from "./PalcoZoom";

const RAIO = 26;
const ESPACO_VERTICAL = 82;
const MARGEM = 50;

/* ─── Converte o array plano da API em árvore encadeada ─────────────────── */
function construirArvore(arr) {
  if (!arr || arr.length === 0) return null;

  const mapa = {};
  arr.forEach((no) => {
    mapa[no.valor] = no;
  });

  /* O nó‑raiz é aquele cujo valor não aparece como esq/dir de nenhum outro */
  const filhos = new Set();
  arr.forEach((no) => {
    if (no.esq !== null) filhos.add(no.esq);
    if (no.dir !== null) filhos.add(no.dir);
  });

  let raizValor = null;
  for (const no of arr) {
    if (!filhos.has(no.valor)) {
      raizValor = no.valor;
      break;
    }
  }
  if (raizValor === null) return null;

  function montar(valor) {
    if (valor === null || mapa[valor] === undefined) return null;
    const no = mapa[valor];
    return {
      valor: no.valor,
      cor: no.cor,
      altura: no.altura,
      esq: montar(no.esq),
      dir: montar(no.dir),
    };
  }
  return montar(raizValor);
}

/* ─── Utilitários de layout (idênticos ao AVL) ─────────────────────────── */
function profundidade(no) {
  if (!no) return 0;
  return 1 + Math.max(profundidade(no.esq), profundidade(no.dir));
}

function posicoes(no, prof, esq, dir, acc = []) {
  if (!no) return acc;
  acc.push({ valor: no.valor, cor: no.cor, x: (esq + dir) / 2, prof });
  posicoes(no.esq, prof + 1, esq, (esq + dir) / 2, acc);
  posicoes(no.dir, prof + 1, (esq + dir) / 2, dir, acc);
  return acc;
}

function arestas(no, prof, esq, dir, acc = []) {
  if (!no) return acc;
  const px = (esq + dir) / 2;
  if (no.esq) {
    arestas(no.esq, prof + 1, esq, (esq + dir) / 2, acc);
    acc.push({
      px,
      py: prof,
      cx: (esq + (esq + dir) / 2) / 2,
      cy: prof + 1,
      corFilho: no.esq.cor,
    });
  }
  if (no.dir) {
    arestas(no.dir, prof + 1, (esq + dir) / 2, dir, acc);
    acc.push({
      px,
      py: prof,
      cx: ((esq + dir) / 2 + dir) / 2,
      cy: prof + 1,
      corFilho: no.dir.cor,
    });
  }
  return acc;
}

/* ─── Altura negra (nós negros num caminho raiz → folha) ───────────────── */
function alturaNegra(no) {
  if (!no) return 0;
  const add = no.cor === "Negro" ? 1 : 0;
  return add + alturaNegra(no.esq); // qualquer caminho serve (propriedade RB)
}

function raizEhNegra(arv) {
  return arv ? arv.cor === "Negro" : true;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Componente visual de um nó Rubro‑Negro
   ═══════════════════════════════════════════════════════════════════════════ */
function NoRN({ x, y, valor, cor, destacado, aoPassar, aoSair }) {
  const ehRubro = cor === "Rubro";

  const corFundo = ehRubro ? "#dc2626" : "#1e293b";
  const corBorda = ehRubro ? "#991b1b" : "#0f172a";
  const corBrilho = ehRubro ? "#f87171" : "#64748b";

  return (
    <Group x={x} y={y} onMouseEnter={aoPassar} onMouseLeave={aoSair}>
      {/* Halo ao passar o mouse */}
      {destacado && (
        <Circle
          radius={RAIO + 5}
          fill="transparent"
          stroke={corBrilho}
          strokeWidth={1.5}
          opacity={0.4}
          shadowColor={corBrilho}
          shadowBlur={18}
          shadowOpacity={0.6}
        />
      )}

      {/* Círculo principal */}
      <Circle
        radius={RAIO}
        fill={destacado ? (ehRubro ? "#fecaca" : "#334155") : corFundo}
        stroke={destacado ? corBrilho : corBorda}
        strokeWidth={destacado ? 2 : 1.8}
      />

      {/* Valor */}
      <Text
        x={-RAIO}
        y={-RAIO}
        width={RAIO * 2}
        height={RAIO * 2}
        text={String(valor)}
        fontSize={13}
        fontFamily="monospace"
        fontStyle="bold"
        fill={destacado ? (ehRubro ? "#991b1b" : "#e2e8f0") : "#ffffff"}
        align="center"
        verticalAlign="middle"
      />

      {/* Badge de cor */}
      <Rect
        x={RAIO - 8}
        y={-RAIO - 15}
        width={28}
        height={14}
        cornerRadius={3}
        fill={ehRubro ? "#fef2f2" : "#f1f5f9"}
        stroke={ehRubro ? "#f87171" : "#64748b"}
        strokeWidth={1}
      />
      <Text
        x={RAIO - 8}
        y={-RAIO - 15}
        width={28}
        height={14}
        text={ehRubro ? "R" : "N"}
        fontSize={8}
        fontFamily="monospace"
        fontStyle="bold"
        fill={ehRubro ? "#dc2626" : "#1e293b"}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Visualizador da Árvore Rubro‑Negra
   ═══════════════════════════════════════════════════════════════════════════ */
export default function RubroNegraVisualizer({ onAcoes }) {
  const [arvore, setArvore] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [valorSobre, setValorSobre] = useState(null);
  const refContainer = useRef(null);
  const [largura, setLargura] = useState(600);
  const [altura, setAltura] = useState(500);

  const load = async () => {
    try {
      const r = await listarRn();
      setArvore(construirArvore(r.data));
    } catch {
      setArvore(null);
    }
  };

  /* ── Carregar árvore da API ── */
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  /* ── Resize ── */
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

  /* ── Toast ── */
  const avisar = (texto, cor = "#00e676") => {
    setMensagem({ texto, cor });
    setTimeout(() => setMensagem(null), 2500);
  };

  /* ── Ações expostas ao painel ── */
  useEffect(() => {
    onAcoes?.({
      inserir: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar("Valor inválido!", "#ff4466");
        try {
          await inserirRn(val);
          setTimeout(() => load(), 300);
          avisar(`Inserido ${val}`);
        } catch {
          avisar("Erro ao inserir!", "#ff4466");
        }
      },
      remover: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar("Valor inválido!", "#ff4466");
        try {
          await removerRn(val);
          setTimeout(() => load(), 300);
          avisar(`Removido ${val}`);
        } catch {
          avisar("Erro ao remover!", "#ff4466");
        }
      },
    });
  }, [onAcoes]);

  /* ── Dados de layout ── */
  const prof = profundidade(arvore);
  const nos = arvore ? posicoes(arvore, 0, 0, 1) : [];
  const edges = arvore ? arestas(arvore, 0, 0, 1) : [];
  const negros = alturaNegra(arvore);
  const maxNosBase = Math.pow(2, Math.max(0, prof - 1));
  const espacoMinimo = maxNosBase * (RAIO * 3);
  const larguraDesenho = Math.max(largura, espacoMinimo);
  const offsetCentralizacao = (larguraDesenho - largura) / 2;

  const toCanvas = (xN, p) => ({
    x: MARGEM + (xN * (larguraDesenho - MARGEM * 2)) - offsetCentralizacao,
    y: 60 + p * ESPACO_VERTICAL,
  });

  /* ── Render ── */
  return (
    <div ref={refContainer} className="relative w-full h-full">
      {/* Toast */}
      {mensagem && (
        <div
          style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none"
        >
          {mensagem.texto}
        </div>
      )}

      {/* Info fixa */}
      <div className="absolute top-3 left-4 flex gap-3 text-[10px] font-mono items-center flex-wrap text-green-600 pointer-events-none z-10 font-semibold">
        <span>
          profundidade: <b>{prof}</b>
        </span>
        <span>
          nós: <b>{nos.length}</b>
        </span>
        <span>
          alt.&nbsp;negra: <b>{negros}</b>
        </span>
        <span className="font-bold">
          {raizEhNegra(arvore) ? "✓ raiz negra" : "⚠ raiz rubro"}
        </span>
        <span style={{ color: "#dc2626" }}>● Rubro</span>
        <span style={{ color: "#1e293b" }}>● Negro</span>
      </div>

      <PalcoZoom width={largura} height={altura}>
        <Layer>
          {/* Fundo branco expandido */}
          <Rect
            x={-5000}
            y={-5000}
            width={largura + 10000}
            height={altura + 10000}
            fill="#ffffff"
          />

          {/* Arestas (cor segue o filho) */}
          {edges.map((e, i) => {
            const p = toCanvas(e.px, e.py);
            const c = toCanvas(e.cx, e.cy);
            const corLinha = e.corFilho === "Rubro" ? "#f87171" : "#64748b";
            return (
              <Line
                key={i}
                points={[p.x, p.y, c.x, c.y]}
                stroke={corLinha}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Nós */}
          {nos.map((n, i) => {
            const pos = toCanvas(n.x, n.prof);
            return (
              <NoRN
                key={i}
                x={pos.x}
                y={pos.y}
                valor={n.valor}
                cor={n.cor}
                destacado={valorSobre === n.valor}
                aoPassar={() => setValorSobre(n.valor)}
                aoSair={() => setValorSobre(null)}
              />
            );
          })}

          {/* Árvore vazia */}
          {!arvore && (
            <Text
              x={0}
              y={altura / 2 - 10}
              width={largura}
              text="Árvore Rubro‑Negra vazia — use o painel para inserir"
              fontSize={12}
              fontFamily="monospace"
              fill="#334155"
              align="center"
            />
          )}
        </Layer>
      </PalcoZoom>
    </div>
  );
}
