import { useState, useRef, useEffect } from 'react';
import { Layer, Rect, Text, Arrow, Group, Line } from 'react-konva';
import {
  visualizarLista,
  adicionarLista,
  adicionarListaOrdenado,
  removerListaPosicao,
  removerListaOrdenado,
} from '../../services/listaservices';
import PalcoZoom from './PalcoZoom';

// ─── Constantes visuais ───────────────────────────────────────────────────────
const LARGURA_NO  = 90;
const ALTURA_NO   = 52;
const ESPACO_NO   = 60;
const RAIO_BORDA  = 6;
const INICIO_X    = 40;
const INICIO_Y    = 80;

// ─── Nó da lista ──────────────────────────────────────────────────────────────
function NoLista({ x, y, valor, indice, destacado, aoPassar, aoSair }) {
  return (
    <Group x={x} y={y} onMouseEnter={() => aoPassar(indice)} onMouseLeave={aoSair}>
      {/* sombra de destaque */}
      {destacado && (
        <Rect x={-3} y={-3} width={LARGURA_NO + 6} height={ALTURA_NO + 6}
          cornerRadius={RAIO_BORDA + 2} fill='transparent'
          stroke='#f5c518' strokeWidth={2} opacity={0.5}
          shadowColor='#f5c518' shadowBlur={16} shadowOpacity={0.6} />
      )}
      {/* corpo */}
      <Rect width={LARGURA_NO} height={ALTURA_NO} cornerRadius={RAIO_BORDA}
        fill={destacado ? '#fef3c7' : '#f1f5f9'}
        stroke={destacado ? '#f59e0b' : '#3b82f6'}
        strokeWidth={destacado ? 2 : 1} />
      {/* divisor valor | próximo */}
      <Rect x={LARGURA_NO * 0.65} y={6} width={1} height={ALTURA_NO - 12}
        fill={destacado ? '#f59e0b' : '#3b82f6'} opacity={0.7} />
      {/* valor */}
      <Text x={0} y={0} width={LARGURA_NO * 0.65} height={ALTURA_NO}
        text={String(valor)} fontSize={16} fontFamily='monospace' fontStyle='bold'
        fill={destacado ? '#d97706' : '#1e293b'} align='center' verticalAlign='middle' />
      {/* seta próximo */}
      <Text x={LARGURA_NO * 0.65} y={0} width={LARGURA_NO * 0.35} height={ALTURA_NO}
        text='→' fontSize={13} fontFamily='monospace'
        fill={destacado ? '#f59e0b' : '#3b82f6'} align='center' verticalAlign='middle' />
      {/* badge índice */}
      <Rect x={-8} y={-8} width={18} height={18} cornerRadius={9}
        fill={destacado ? '#f59e0b' : '#3b82f6'} />
      <Text x={-8} y={-8} width={18} height={18} text={String(indice)}
        fontSize={9} fontFamily='monospace' fontStyle='bold'
        fill='#fff' align='center' verticalAlign='middle' />
    </Group>
  );
}

function NoNull({ x, y }) {
  return (
    <Group x={x} y={y}>
      <Rect width={48} height={ALTURA_NO} cornerRadius={RAIO_BORDA}
        fill='#fee2e2' stroke='#ef4444' strokeWidth={1} dash={[4, 3]} />
      <Text width={48} height={ALTURA_NO} text='NULL' fontSize={10}
        fontFamily='monospace' fontStyle='bold'
        fill='#dc2626' align='center' verticalAlign='middle' />
    </Group>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function ListaVisualizer({ onAcoes }) {
  const [lista, setLista]             = useState([]);
  const [indiceSobre, setIndiceSobre] = useState(null);
  const [mensagem, setMensagem]       = useState(null);
  const refContainer                  = useRef(null);
  const [largura, setLargura]         = useState(600);
  const [altura, setAltura]           = useState(400);

  const carregar = async () => {
    try { const r = await visualizarLista(); setLista(r.data || []); }
    catch { setLista([]); }
  };

  useEffect(() => { carregar(); }, []);

  // Recarrega periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      carregar();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Responsividade
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

  // ── Ações expostas ao painel lateral ──────────────────────────────────────
  useEffect(() => {
    onAcoes?.({
      inserir: async (valor, pos) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar('Valor inválido!', '#ff4466');
        try {
          if (pos === '' || pos === undefined || pos === null) {
            await adicionarListaOrdenado(val);
            avisar(`Inserido ${val} (ordenado)`);
          } else {
            const p = parseInt(pos);
            if (isNaN(p) || p < 0 || p > lista.length)
              return avisar(`Posição inválida (0–${lista.length})`, '#ff4466');
            await adicionarLista(val, p);
            avisar(`Inserido ${val} na pos. ${p}`);
          }
          setTimeout(() => carregar(), 300);
        } catch { avisar('Erro ao inserir!', '#ff4466'); }
      },
      remover: async (valor) => {
        const val = parseInt(valor);
        if (!isNaN(val)) {
          // tenta remover por valor (ordenado)
          try { await removerListaOrdenado(val); setTimeout(() => carregar(), 300); avisar(`Removido ${val}`); return; }
          catch { /* fallback: tenta por posição */ }
        }
        const pos = parseInt(valor);
        if (isNaN(pos) || pos < 0 || pos >= lista.length)
          return avisar(`Índice inválido (0–${lista.length - 1})`, '#ff4466');
        try { await removerListaPosicao(pos); setTimeout(() => carregar(), 300); avisar(`Removida pos. ${pos}`); }
        catch { avisar('Erro ao remover!', '#ff4466'); }
      },
    });
  }, [lista]);

  const larguraTotal  = lista.length * (LARGURA_NO + ESPACO_NO) + 48 + INICIO_X * 2;
  const larguraCena   = Math.max(largura, larguraTotal);

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {/* Mensagem flutuante */}
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 backdrop-blur-sm pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      {/* Info - fixa */}
      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono text-green-600 pointer-events-none z-10 font-semibold'>
        <span className='font-bold'>CIRCULAR</span>
        <span>tamanho: <b>{lista.length}</b></span>
        <span>cabeça: <b>{lista.length > 0 ? lista[0] : 'NULL'}</b></span>
        <span>cauda: <b>{lista.length > 0 ? lista[lista.length - 1] : 'NULL'}</b></span>
      </div>

      <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <PalcoZoom width={larguraCena} height={altura || 400}>
          <Layer>
            {/* Fundo branco expandido */}
            <Rect x={-5000} y={-5000} width={larguraCena + 10000} height={(altura || 400) + 10000} fill='#ffffff' />
            {/* Label CABEÇA */}
            <Text x={INICIO_X} y={INICIO_Y - 32} text='CABEÇA' fontSize={9}
              fontFamily='monospace' fontStyle='bold' fill='#f5c518' letterSpacing={2} />
            <Rect x={INICIO_X} y={INICIO_Y - 20} width={2} height={12} fill='#f5c518' opacity={0.5} />

            {/* Nós */}
            {lista.map((val, i) => (
              <NoLista key={i}
                x={INICIO_X + i * (LARGURA_NO + ESPACO_NO)} y={INICIO_Y}
                valor={val} indice={i}
                destacado={indiceSobre === i}
                aoPassar={setIndiceSobre}
                aoSair={() => setIndiceSobre(null)} />
            ))}

            {/* Setas entre nós */}
            {lista.map((_, i) => {
              if (i >= lista.length - 1) return null;
              const x1 = INICIO_X + i * (LARGURA_NO + ESPACO_NO) + LARGURA_NO;
              const x2 = INICIO_X + (i + 1) * (LARGURA_NO + ESPACO_NO);
              const y  = INICIO_Y + ALTURA_NO / 2;
              const hl = indiceSobre === i || indiceSobre === i + 1;
              return (
                <Arrow key={`s${i}`} points={[x1 + 4, y, x2 - 4, y]}
                  stroke={hl ? '#f59e0b' : '#3b82f6'} strokeWidth={hl ? 2 : 1.5}
                  fill={hl ? '#f59e0b' : '#3b82f6'} pointerLength={7} pointerWidth={5} />
              );
            })}

            {/* Seta do último para o primeiro (lista circular) */}
            {lista.length > 1 && (() => {
              const ultimoX = INICIO_X + (lista.length - 1) * (LARGURA_NO + ESPACO_NO) + LARGURA_NO;
              const ultimoY = INICIO_Y + ALTURA_NO / 2;
              const primeiroX = INICIO_X;
              const primeiroY = INICIO_Y + ALTURA_NO / 2;
              const alturaArco = 60;
              
              // Curva de Bézier para a seta circular
              const pontoControle1X = ultimoX + 40;
              const pontoControle1Y = ultimoY - alturaArco;
              const pontoControle2X = primeiroX - 40;
              const pontoControle2Y = primeiroY - alturaArco;
              
              return (
                <>
                  {/* Linha curva */}
                  <Line
                    points={[
                      ultimoX + 4, ultimoY,
                      pontoControle1X, pontoControle1Y,
                      pontoControle2X, pontoControle2Y,
                      primeiroX - 4, primeiroY
                    ]}
                    stroke='#10b981'
                    strokeWidth={2}
                    tension={0.5}
                    bezier
                  />
                  {/* Seta no final */}
                  <Arrow
                    points={[
                      primeiroX - 12, primeiroY - 8,
                      primeiroX - 4, primeiroY
                    ]}
                    stroke='#10b981'
                    strokeWidth={2}
                    fill='#10b981'
                    pointerLength={7}
                    pointerWidth={5}
                  />
                </>
              );
            })()}

            {/* Estado vazio */}
            {lista.length === 0 && (
              <Text x={0} y={(altura || 400) / 2 - 10} width={larguraCena}
                text='Lista vazia — use o painel para inserir'
                fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
            )}
          </Layer>
        </PalcoZoom>
      </div>
    </div>
  );
}
