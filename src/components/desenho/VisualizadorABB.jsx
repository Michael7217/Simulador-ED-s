import { useState, useRef, useEffect } from 'react';
import { Layer, Circle, Text, Line, Group, Rect } from 'react-konva';
import {
  visualizarAbb,
  inserirAbb,
  removerAbb,
  preOrdem,
  posOrdem,
  emOrdem,
} from '../../services/abbServices';
import PalcoZoom from './PalcoZoom';

const RAIO            = 24;
const ESPACO_VERTICAL = 75;
const MARGEM          = 50;

// ─── Layout recursivo ─────────────────────────────────────────────────────────
function profundidade(no) {
  if (!no) return 0;
  return 1 + Math.max(profundidade(no.esq), profundidade(no.dir));
}
function posicoes(no, prof, esq, dir, acc = []) {
  if (!no) return acc;
  acc.push({ valor: no.valor, x: (esq + dir) / 2, prof });
  posicoes(no.esq, prof + 1, esq, (esq + dir) / 2, acc);
  posicoes(no.dir, prof + 1, (esq + dir) / 2, dir, acc);
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

function NoABB({ x, y, valor, destacado, aoPassar, aoSair }) {
  return (
    <Group x={x} y={y} onMouseEnter={aoPassar} onMouseLeave={aoSair}>
      {destacado && (
        <Circle radius={RAIO + 5} fill='transparent' stroke='#fb923c'
          strokeWidth={1.5} opacity={0.4}
          shadowColor='#fb923c' shadowBlur={18} shadowOpacity={0.6} />
      )}
      <Circle radius={RAIO}
        fill={destacado ? '#fff7ed' : '#f1f5f9'}
        stroke={destacado ? '#fb923c' : '#64748b'}
        strokeWidth={destacado ? 2 : 1.5} />
      <Text x={-RAIO} y={-RAIO} width={RAIO * 2} height={RAIO * 2}
        text={String(valor)} fontSize={13} fontFamily='monospace' fontStyle='bold'
        fill={destacado ? '#ea580c' : '#1e293b'} align='center' verticalAlign='middle' />
    </Group>
  );
}

export default function ABBVisualizer({ onAcoes }) {
  const [arvore, setArvore]                     = useState(null);
  const [mensagem, setMensagem]                 = useState(null);
  const [resultadoPercurso, setResultadoPercurso] = useState(null);
  const [valorSobre, setValorSobre]             = useState(null);
  const refContainer                            = useRef(null);
  const [largura, setLargura]                   = useState(600);
  const [altura, setAltura]                     = useState(500);

  const load = async () => {
    try { const r = await visualizarAbb(); setArvore(r.data || null); }
    catch { setArvore(null); }
  };

  useEffect(() => { load(); }, []);

  // Recarrega periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      load();
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
        try { await inserirAbb(val); setTimeout(() => load(), 300); avisar(`Inserido ${val}`); }
        catch { avisar('Erro ao inserir!', '#ff4466'); }
      },
      remover: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar('Valor inválido!', '#ff4466');
        try { await removerAbb(val); setTimeout(() => load(), 300); avisar(`Removido ${val}`); }
        catch { avisar('Erro ao remover!', '#ff4466'); }
      },
      preOrdem: async () => {
        try { const r = await preOrdem(); setResultadoPercurso({ rotulo: 'Pré-Ordem', dados: r.data }); }
        catch { avisar('Erro no percurso', '#ff4466'); }
      },
      emOrdem: async () => {
        try { const r = await emOrdem(); setResultadoPercurso({ rotulo: 'Em Ordem', dados: r.data }); }
        catch { avisar('Erro no percurso', '#ff4466'); }
      },
      posOrdem: async () => {
        try { const r = await posOrdem(); setResultadoPercurso({ rotulo: 'Pós-Ordem', dados: r.data }); }
        catch { avisar('Erro no percurso', '#ff4466'); }
      },
    });
  }, [arvore]);

  const prof    = profundidade(arvore);
  const nos     = arvore ? posicoes(arvore, 0, 0, 1) : [];
  const edges   = arvore ? arestas(arvore, 0, 0, 1) : [];
  const toCanvas = (xN, p) => ({
    x: MARGEM + xN * (largura - MARGEM * 2),
    y: 55 + p * ESPACO_VERTICAL,
  });

  return (
    <div ref={refContainer} className='relative w-full h-full flex flex-col'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      {/* Info - fixa */}
      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono text-green-600 pointer-events-none z-10 font-semibold'>
        <span>profundidade: <b>{prof}</b></span>
        <span>nós: <b>{nos.length}</b></span>
        {arvore && <span>raiz: <b>{arvore.valor}</b></span>}
      </div>

      {/* Resultado do percurso */}
      {resultadoPercurso && (
        <div className='absolute bottom-3 left-3 right-3 z-10 border border-orange-400/40 rounded-lg px-3 py-2 text-[10px] font-mono bg-black/80 flex items-center gap-3 pointer-events-auto'>
          <span className='text-orange-400 font-bold min-w-[80px]'>{resultadoPercurso.rotulo}:</span>
          <span className='text-slate-300 flex-1 overflow-x-auto whitespace-nowrap'>
            {(resultadoPercurso.dados || []).join(' → ')}
          </span>
          <button onClick={() => setResultadoPercurso(null)} className='text-slate-500 hover:text-white ml-2'>✕</button>
        </div>
      )}

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
              <NoABB key={i} x={pos.x} y={pos.y} valor={n.valor}
                destacado={valorSobre === n.valor}
                aoPassar={() => setValorSobre(n.valor)}
                aoSair={() => setValorSobre(null)} />
            );
          })}
          {!arvore && (
            <Text x={0} y={altura / 2 - 10} width={largura}
              text='Árvore vazia — use o painel para inserir'
              fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
          )}
        </Layer>
      </PalcoZoom>
    </div>
  );
}
