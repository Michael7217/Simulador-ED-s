import { useState, useRef, useEffect } from 'react';
import { Layer, Circle, Text, Line, Group, Rect } from 'react-konva';
import { inserirAvl, removerAvl, visualizarArvore } from '../../services/avlServices';
import PalcoZoom from './PalcoZoom';

const RAIO            = 26;
const ESPACO_VERTICAL = 82;
const MARGEM          = 50;

// ─── Parse ["Chave: 20 | Equilíbrio: 1", ...] ───────────────────────────────────────


function corBal(b) {
  if (Math.abs(b) <= 1) return '#34d399';
  if (Math.abs(b) === 2) return '#fb923c';
  return '#f87171';
}

function profundidade(no) {
  if (!no) return 0;
  return 1 + Math.max(profundidade(no.esq), profundidade(no.dir));
}
function posicoes(no, prof, esq, dir, mapa = {}, acc = []) {
  if (!no) return acc;
  const valor = no.valor || no.chave;
  const bal = mapa[valor] !== undefined ? mapa[valor] : null;
  acc.push({ valor, x: (esq + dir) / 2, prof, bal });
  posicoes(no.esq, prof + 1, esq, (esq + dir) / 2, mapa, acc);
  posicoes(no.dir, prof + 1, (esq + dir) / 2, dir, mapa, acc);
  return acc;
}
function arestas(no, prof, esq, dir, acc = []) {
  if (!no) return acc;
  const px = (esq + dir) / 2;
  if (no.esq) {
    arestas(no.esq, prof + 1, esq, (esq + dir) / 2, acc);
    acc.push({ px, py: prof, cx: (esq + (esq + dir) / 2) / 2, cy: prof + 1 });
  }
  if (no.dir) {
    arestas(no.dir, prof + 1, (esq + dir) / 2, dir, acc);
    acc.push({ px, py: prof, cx: ((esq + dir) / 2 + dir) / 2, cy: prof + 1 });
  }
  return acc;
}

function NoAVL({ x, y, valor, bal, destacado, aoPassar, aoSair }) {
  const bc = bal !== null ? corBal(bal) : '#2a3560';
  return (
    <Group x={x} y={y} onMouseEnter={aoPassar} onMouseLeave={aoSair}>
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
      {/* Badge balanceamento */}
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

export default function AVLVisualizer({ onAcoes }) {
  const [arvore, setArvore]           = useState(null);
  const [mapaBal, setMapaBal]         = useState({});
  const [mensagem, setMensagem]       = useState(null);
  const [valorSobre, setValorSobre]   = useState(null);
  const refContainer                  = useRef(null);
  const [largura, setLargura]         = useState(600);
  const [altura, setAltura]           = useState(500);

  const carregar = async () => {
    try {
      const rA = await visualizarArvore();
      setArvore(rA.data || null);
      // Extrai balanceamento direto da árvore
      const mapa = {};
      const extrairBal = (no) => {
        if (!no) return;
        const valor = no.valor || no.chave;
        mapa[valor] = no.bal !== undefined ? no.bal : 0;
        extrairBal(no.esq);
        extrairBal(no.dir);
      };
      extrairBal(rA.data);
      setMapaBal(mapa);
    } catch { setArvore(null); setMapaBal({}); }
  };

  useEffect(() => { carregar(); }, []);

  // Recarrega periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      carregar();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

  const prof     = profundidade(arvore);
  const nos      = arvore ? posicoes(arvore, 0, 0, 1, mapaBal) : [];
  const edges    = arvore ? arestas(arvore, 0, 0, 1) : [];
  const balanceada = nos.every(n => Math.abs(n.bal || 0) <= 1);

  const toCanvas = (xN, p) => ({
    x: MARGEM + xN * (largura - MARGEM * 2),
    y: 60 + p * ESPACO_VERTICAL,
  });

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      {/* Info + legenda - fixa */}
      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono items-center flex-wrap text-green-600 pointer-events-none z-10 font-semibold'>
        <span>profundidade: <b>{prof}</b></span>
        <span>nós: <b>{nos.length}</b></span>
        <span className='font-bold'>
          {balanceada ? '✓ balanceada' : '⚠ desbalanceada'}
        </span>
        <span>● ok</span>
        <span>● alerta</span>
        <span>● erro</span>
      </div>

      <PalcoZoom width={largura} height={altura}>
        <Layer>
          {/* Fundo branco expandido */}
          <Rect x={-5000} y={-5000} width={largura + 10000} height={altura + 10000} fill='#ffffff' />
          {edges.map((e, i) => {
            const p = toCanvas(e.px, e.py);
            const c = toCanvas(e.cx, e.cy);
            return <Line key={i} points={[p.x, p.y, c.x, c.y]} stroke='#64748b' strokeWidth={1.5} />;
          })}
          {nos.map((n, i) => {
            const pos = toCanvas(n.x, n.prof);
            return (
              <NoAVL key={i} x={pos.x} y={pos.y} valor={n.valor} bal={n.bal}
                destacado={valorSobre === n.valor}
                aoPassar={() => setValorSobre(n.valor)}
                aoSair={() => setValorSobre(null)} />
            );
          })}
          {!arvore && (
            <Text x={0} y={altura / 2 - 10} width={largura}
              text='Árvore AVL vazia — use o painel para inserir'
              fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
          )}
        </Layer>
      </PalcoZoom>
    </div>
  );
}
