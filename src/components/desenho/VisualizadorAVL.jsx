import { useState, useRef, useEffect, useCallback } from 'react';
import { Layer, Circle, Text, Line, Group, Rect } from 'react-konva';
import Konva from 'konva';
import { inserirAvl, removerAvl, visualizarArvore } from '../../services/avlServices';
import PalcoZoom from './PalcoZoom';

const RAIO            = 26;
const ESPACO_VERTICAL = 82;
const MARGEM          = 50;
const DURACAO_ANIM    = 0.75; // mais lento para visualizar rotações

// ─── Utilitários de layout ───────────────────────────────────────────────────
function corBal(b) {
  if (Math.abs(b) <= 1) return '#34d399';
  if (Math.abs(b) === 2) return '#fb923c';
  return '#f87171';
}

function profundidade(no) {
  if (!no) return 0;
  return 1 + Math.max(profundidade(no.esq), profundidade(no.dir));
}

// Retorna mapa valor → {x, y} em coordenadas de canvas
function calcPosicoes(no, prof, esq, dir, larguraDesenho, acc = {}) {
  if (!no) return acc;
  const valor = no.valor ?? no.chave;
  acc[valor] = {
    x: MARGEM + ((esq + dir) / 2) * (larguraDesenho - MARGEM * 2),
    y: 60 + prof * ESPACO_VERTICAL,
  };
  calcPosicoes(no.esq, prof + 1, esq, (esq + dir) / 2, larguraDesenho, acc);
  calcPosicoes(no.dir, prof + 1, (esq + dir) / 2, dir, larguraDesenho, acc);
  return acc;
}

// Retorna lista de arestas {pai, filho}
function calcArestas(no, acc = []) {
  if (!no) return acc;
  const pai = no.valor ?? no.chave;
  if (no.esq) { acc.push({ pai, filho: no.esq.valor ?? no.esq.chave }); calcArestas(no.esq, acc); }
  if (no.dir) { acc.push({ pai, filho: no.dir.valor ?? no.dir.chave }); calcArestas(no.dir, acc); }
  return acc;
}

// Extrai lista plana de nós com balanceamento
function extrairNos(no, mapa = []) {
  if (!no) return mapa;
  const valor = no.valor ?? no.chave;
  mapa.push({ valor, bal: no.bal ?? 0 });
  extrairNos(no.esq, mapa);
  extrairNos(no.dir, mapa);
  return mapa;
}

// ─── Nó AVL animado ──────────────────────────────────────────────────────────
function NoAVL({ valor, bal, posAlvo, estado, destacado, aoPassar, aoSair }) {
  const ref  = useRef();
  const bc   = corBal(bal ?? 0);
  const prevPos = useRef(posAlvo);

  // Primeira montagem: posiciona sem animação
  useEffect(() => {
    if (!ref.current) return;
    if (estado === 'novo') {
      // Entra com scale 0 na posição alvo
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
  }, []); // só na montagem

  // Animação de remoção
  useEffect(() => {
    if (!ref.current || estado !== 'removendo') return;
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      scaleX: 0,
      scaleY: 0,
      opacity: 0,
      easing: Konva.Easings.EaseInOut,
    }).play();
  }, [estado]);

  // Movimento suave de rotação / rebalanceamento
  useEffect(() => {
    if (!ref.current || estado === 'novo' || estado === 'removendo') return;
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
        <Circle radius={RAIO + 5} fill='transparent' stroke='#38bdf8'
          strokeWidth={1.5} opacity={0.4}
          shadowColor='#38bdf8' shadowBlur={18} shadowOpacity={0.6} />
      )}
      <Circle radius={RAIO}
        fill={destacado ? '#ecfeff' : '#f1f5f9'}
        stroke={destacado ? '#38bdf8' : bc}
        strokeWidth={destacado ? 2 : 1.8} />
      <Text x={-RAIO} y={-RAIO} width={RAIO * 2} height={RAIO * 2}
        text={String(valor)} fontSize={13} fontFamily='monospace' fontStyle='bold'
        fill={destacado ? '#0284c7' : '#1e293b'} align='center' verticalAlign='middle' />
      {bal !== null && (
        <>
          <Rect x={RAIO - 4} y={-RAIO - 15} width={20} height={14} cornerRadius={3}
            fill={`${bc}22`} stroke={bc} strokeWidth={1} />
          <Text x={RAIO - 4} y={-RAIO - 15} width={20} height={14}
            text={bal >= 0 ? `+${bal}` : String(bal)}
            fontSize={8} fontFamily='monospace' fontStyle='bold'
            fill={bc} align='center' verticalAlign='middle' />
        </>
      )}
    </Group>
  );
}

// ─── Aresta animada ──────────────────────────────────────────────────────────
// Usa refs para atualizar pontos via Konva diretamente, evitando piscar
function ArestaAVL({ posAlvoPai, posAlvoFilho }) {
  const ref = useRef();
  const prevPai   = useRef(posAlvoPai);
  const prevFilho = useRef(posAlvoFilho);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.points([posAlvoPai.x, posAlvoPai.y, posAlvoFilho.x, posAlvoFilho.y]);
    prevPai.current   = posAlvoPai;
    prevFilho.current = posAlvoFilho;
  }, []); // montagem inicial

  useEffect(() => {
    if (!ref.current) return;
    const startP = { ...prevPai.current };
    const startF = { ...prevFilho.current };
    const endP   = posAlvoPai;
    const endF   = posAlvoFilho;

    const moved = Math.abs(endP.x - startP.x) > 0.5 || Math.abs(endP.y - startP.y) > 0.5 ||
                  Math.abs(endF.x - startF.x) > 0.5 || Math.abs(endF.y - startF.y) > 0.5;

    if (!moved) return;

    // Anima incrementalmente via requestAnimationFrame
    const startTime = performance.now();
    const dur       = DURACAO_ANIM * 1000;

    const tick = (now) => {
      const t    = Math.min((now - startTime) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
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
      stroke='#64748b' strokeWidth={1.5} />
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function AVLVisualizer({ onAcoes }) {
  const [arvore, setArvore]         = useState(null);
  // Mapa estável de nós: valor → {valor, bal, posAlvo, estado}
  const [nosMap, setNosMap]         = useState({});
  // Lista de arestas: [{pai, filho}]
  const [arestas, setArestas]       = useState([]);
  const [mensagem, setMensagem]     = useState(null);
  const [valorSobre, setValorSobre] = useState(null);
  const refContainer                = useRef(null);
  const [largura, setLargura]       = useState(600);
  const [altura, setAltura]         = useState(500);
  const animandoRef                 = useRef(false);
  // Guarda posições calculadas do frame anterior (para arestas animadas)
  const posAnteriorRef              = useRef({});

  const calcLarguraDesenho = useCallback((arv, larg) => {
    const prof       = profundidade(arv);
    const maxNosBase = Math.pow(2, Math.max(0, prof - 1));
    const minEspaco  = maxNosBase * (RAIO * 3);
    return Math.max(larg, minEspaco);
  }, []);

  const carregar = useCallback(async () => {
    if (animandoRef.current) return;
    try {
      const rA = await visualizarArvore();
      setArvore(rA.data || null);
    } catch { setArvore(null); }
  }, []);

  useEffect(() => { carregar(); }, []);
  useEffect(() => {
    const id = setInterval(carregar, 2000);
    return () => clearInterval(id);
  }, [carregar]);

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

  // Quando a árvore muda, recalcula posições e detecta inserções/remoções/rotações
  useEffect(() => {
    const larguraDesenho = calcLarguraDesenho(arvore, largura);
    const novasPosicoes  = arvore ? calcPosicoes(arvore, 0, 0, 1, larguraDesenho) : {};
    const novosNos       = arvore ? extrairNos(arvore) : [];
    const novasArestas   = arvore ? calcArestas(arvore) : [];

    const novosValores   = new Set(novosNos.map((n) => n.valor));
    const antigosValores = new Set(Object.keys(nosMap).map(Number));

    const inseridos  = [...novosValores].filter((v) => !antigosValores.has(v));
    const removidos  = [...antigosValores].filter((v) => !novosValores.has(v));

    // Marca removidos → animação de saída
    if (removidos.length) {
      animandoRef.current = true;
      setNosMap((prev) => {
        const next = { ...prev };
        removidos.forEach((v) => {
          if (next[v]) next[v] = { ...next[v], estado: 'removendo' };
        });
        return next;
      });
      setTimeout(() => {
        animandoRef.current = false;
        // Aplica novo estado limpo
        const mapaFinal = {};
        novosNos.forEach((n) => {
          mapaFinal[n.valor] = {
            valor: n.valor,
            bal: n.bal,
            posAlvo: novasPosicoes[n.valor] || { x: 0, y: 0 },
            estado: 'normal',
          };
        });
        posAnteriorRef.current = novasPosicoes;
        setNosMap(mapaFinal);
        setArestas(novasArestas);
      }, DURACAO_ANIM * 1000 + 50);
    } else {
      // Sem remoções: atualiza posições (animação de movimento / rotação)
      setNosMap((prev) => {
        const next = {};
        novosNos.forEach((n) => {
          const jaExiste = prev[n.valor];
          next[n.valor] = {
            valor: n.valor,
            bal: n.bal,
            posAlvo: novasPosicoes[n.valor] || { x: 0, y: 0 },
            // Se é novo → estado 'novo', senão 'normal'
            estado: inseridos.includes(n.valor) ? 'novo' : 'normal',
          };
        });
        return next;
      });
      posAnteriorRef.current = novasPosicoes;
      setArestas(novasArestas);
    }

    // Limpa estado 'novo' após animação
    if (inseridos.length) {
      setTimeout(() => {
        setNosMap((prev) => {
          const next = { ...prev };
          inseridos.forEach((v) => {
            if (next[v]) next[v] = { ...next[v], estado: 'normal' };
          });
          return next;
        });
      }, DURACAO_ANIM * 1000 + 50);
    }
  }, [arvore, largura]);

  const avisar = (texto, cor = '#00e676') => {
    setMensagem({ texto, cor });
    setTimeout(() => setMensagem(null), 2500);
  };

  useEffect(() => {
    onAcoes?.({
      inserir: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar('Valor inválido!', '#ff4466');
        try { await inserirAvl(val); setTimeout(() => carregar(), 300); avisar(`Inserido ${val}`); }
        catch { avisar('Erro ao inserir!', '#ff4466'); }
      },
      remover: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar('Valor inválido!', '#ff4466');
        try { await removerAvl(val); setTimeout(() => carregar(), 300); avisar(`Removido ${val}`); }
        catch { avisar('Erro ao remover!', '#ff4466'); }
      },
    });
  }, [arvore]);

  const prof       = profundidade(arvore);
  const nosLista   = Object.values(nosMap);
  const balanceada = nosLista.every((n) => Math.abs(n.bal ?? 0) <= 1);

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono items-center flex-wrap text-green-600 pointer-events-none z-10 font-semibold'>
        <span>profundidade: <b>{prof}</b></span>
        <span>nós: <b>{nosLista.filter(n => n.estado !== 'removendo').length}</b></span>
        <span className='font-bold'>{balanceada ? '✓ balanceada' : '⚠ desbalanceada'}</span>
        <span>● ok</span>
        <span>● alerta</span>
        <span>● erro</span>
      </div>

      <PalcoZoom width={largura} height={altura}>
        <Layer>
          <Rect x={-5000} y={-5000} width={largura + 10000} height={altura + 10000} fill='#ffffff' />

          {/* Arestas animadas — renderizadas antes dos nós */}
          {arestas.map((e, i) => {
            const posPai   = nosMap[e.pai]?.posAlvo;
            const posFilho = nosMap[e.filho]?.posAlvo;
            if (!posPai || !posFilho) return null;
            return (
              <ArestaAVL key={`${e.pai}-${e.filho}`}
                posAlvoPai={posPai} posAlvoFilho={posFilho} />
            );
          })}

          {/* Nós animados */}
          {nosLista.map((n) => (
            <NoAVL key={n.valor}
              valor={n.valor}
              bal={n.bal}
              posAlvo={n.posAlvo}
              estado={n.estado}
              destacado={valorSobre === n.valor}
              aoPassar={() => setValorSobre(n.valor)}
              aoSair={() => setValorSobre(null)} />
          ))}

          {!arvore && nosLista.length === 0 && (
            <Text x={0} y={altura / 2 - 10} width={largura}
              text='Árvore AVL vazia — use o painel para inserir'
              fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
          )}
        </Layer>
      </PalcoZoom>
    </div>
  );
}