import { useState, useRef, useEffect, useCallback } from 'react';
import { Layer, Rect, Text, Arrow, Group, Line } from 'react-konva';
import Konva from 'konva';
import {
  visualizarLista,
  adicionarListaInicio,
  adicionarListaMeio,
  adicionarListaFim,
  adicionarListaOrdenado,
  removerListaPosicao,
  removerListaOrdenado,
} from '../../services/listaservices';
import PalcoZoom from './PalcoZoom';

const LARGURA_NO   = 90;
const ALTURA_NO    = 52;
const ESPACO_NO    = 60;
const RAIO_BORDA   = 6;
const INICIO_X     = 40;
const INICIO_Y     = 80;
const DURACAO_ANIM = 0.6;

// ─── Nó animado ─────────────────────────────────────────────────────────────
function NoLista({ x, y, valor, indice, destacado, estado, aoPassar, aoSair }) {
  const ref = useRef();

  // Inserção: cai de cima com bounce
  useEffect(() => {
    if (!ref.current || estado !== 'novo') return;
    ref.current.y(y - 70);
    ref.current.opacity(0);
    ref.current.scaleX(0.5);
    ref.current.scaleY(0.5);
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      y,
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.BounceEaseOut,
    }).play();
  }, [estado]);

  // Remoção: shrink e fade
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

  // Movimento suave horizontal (posição na lista muda após inserção/remoção)
  useEffect(() => {
    if (!ref.current || estado === 'novo' || estado === 'removendo') return;
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM * 0.9,
      x,
      easing: Konva.Easings.EaseInOut,
    }).play();
  }, [x, estado]);

  return (
    <Group ref={ref} x={x} y={y} onMouseEnter={() => aoPassar(indice)} onMouseLeave={aoSair}>
      {destacado && (
        <Rect x={-3} y={-3} width={LARGURA_NO + 6} height={ALTURA_NO + 6}
          cornerRadius={RAIO_BORDA + 2} fill='transparent'
          stroke='#f5c518' strokeWidth={2} opacity={0.5}
          shadowColor='#f5c518' shadowBlur={16} shadowOpacity={0.6} />
      )}
      <Rect width={LARGURA_NO} height={ALTURA_NO} cornerRadius={RAIO_BORDA}
        fill={destacado ? '#fef3c7' : '#f1f5f9'}
        stroke={destacado ? '#f59e0b' : '#3b82f6'}
        strokeWidth={destacado ? 2 : 1} />
      <Rect x={LARGURA_NO * 0.65} y={6} width={1} height={ALTURA_NO - 12}
        fill={destacado ? '#f59e0b' : '#3b82f6'} opacity={0.7} />
      <Text x={0} y={0} width={LARGURA_NO * 0.65} height={ALTURA_NO}
        text={String(valor)} fontSize={16} fontFamily='monospace' fontStyle='bold'
        fill={destacado ? '#d97706' : '#1e293b'} align='center' verticalAlign='middle' />
      <Text x={LARGURA_NO * 0.65} y={0} width={LARGURA_NO * 0.35} height={ALTURA_NO}
        text='→' fontSize={13} fontFamily='monospace'
        fill={destacado ? '#f59e0b' : '#3b82f6'} align='center' verticalAlign='middle' />
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

// ─── Componente principal ────────────────────────────────────────────────────
export default function ListaVisualizer({ onAcoes }) {
  const [lista, setLista]             = useState([]);
  const [nosRenderizados, setNosR]    = useState([]);
  const [nosNovos, setNosNovos]       = useState(new Set());
  const [nosRemovendo, setNosRemov]   = useState(new Set());
  const [indiceSobre, setIndiceSobre] = useState(null);
  const [mensagem, setMensagem]       = useState(null);
  const refContainer                  = useRef(null);
  const [largura, setLargura]         = useState(600);
  const [altura, setAltura]           = useState(400);
  const animandoRef                   = useRef(false);

  const carregar = useCallback(async () => {
    if (animandoRef.current) return;
    try { const r = await visualizarLista(); setLista(r.data || []); }
    catch { setLista([]); }
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

  const avisar = (texto, cor = '#00e676') => {
    setMensagem({ texto, cor });
    setTimeout(() => setMensagem(null), 2500);
  };

  // Diff → animações
  useEffect(() => {
    const makeId = (v, i) => `${v}_${i}`;
    const antigosIds = new Set(nosRenderizados.map((n) => makeId(n.valor, n.indice)));
    const novosIds   = new Set(lista.map((v, i) => makeId(v, i)));

    const removidos = nosRenderizados.filter((n) => !novosIds.has(makeId(n.valor, n.indice)));
    const inseridos = lista.map((v, i) => makeId(v, i)).filter((id) => !antigosIds.has(id));

    if (removidos.length) {
      animandoRef.current = true;
      setNosRemov(new Set(removidos.map((n) => makeId(n.valor, n.indice))));
      setTimeout(() => {
        animandoRef.current = false;
        setNosR(lista.map((v, i) => ({ valor: v, indice: i })));
        setNosRemov(new Set());
      }, DURACAO_ANIM * 1000 + 100);
    } else {
      setNosR(lista.map((v, i) => ({ valor: v, indice: i })));
    }

    if (inseridos.length) {
      setNosNovos(new Set(inseridos));
      setTimeout(() => setNosNovos(new Set()), DURACAO_ANIM * 1000 + 100);
    }
  }, [lista]);

  useEffect(() => {
    onAcoes?.({
      inserir: async (valor, pos) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar('Valor inválido!', '#ff4466');
        try {
          if (pos === 'inicio') {
            await adicionarListaInicio(val); avisar(`Inserido ${val} no início`);
          } else if (pos === 'meio') {
            await adicionarListaMeio(val); avisar(`Inserido ${val} no meio`);
          } else if (pos === 'fim') {
            await adicionarListaFim(val); avisar(`Inserido ${val} no fim`);
          } else if (pos === '' || pos === undefined || pos === null) {
            await adicionarListaOrdenado(val); avisar(`Inserido ${val} (ordenado)`);
          } else {
            const p = parseInt(pos);
            if (isNaN(p) || p < 0 || p > lista.length)
              return avisar(`Posição inválida (0–${lista.length})`, '#ff4466');
            const posicaoMeio = Math.floor(lista.length / 2);
            if (p === 0) { await adicionarListaInicio(val); avisar(`Inserido ${val} no início`); }
            else if (p === lista.length) { await adicionarListaFim(val); avisar(`Inserido ${val} no fim`); }
            else if (p === posicaoMeio) { await adicionarListaMeio(val); avisar(`Inserido ${val} no meio`); }
          }
          setTimeout(() => carregar(), 300);
        } catch { avisar('Erro ao inserir!', '#ff4466'); }
      },
      remover: async (valor) => {
        const val = parseInt(valor);
        if (!isNaN(val)) {
          try { await removerListaOrdenado(val); setTimeout(() => carregar(), 300); avisar(`Removido ${val}`); return; }
          catch { /* fallback */ }
        }
        const pos = parseInt(valor);
        if (isNaN(pos) || pos < 0 || pos >= lista.length)
          return avisar(`Índice inválido (0–${lista.length - 1})`, '#ff4466');
        try { await removerListaPosicao(pos); setTimeout(() => carregar(), 300); avisar(`Removida pos. ${pos}`); }
        catch { avisar('Erro ao remover!', '#ff4466'); }
      },
    });
  }, [lista]);

  const larguraTotal = nosRenderizados.length * (LARGURA_NO + ESPACO_NO) + 48 + INICIO_X * 2;
  const larguraCena  = Math.max(largura, larguraTotal);

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 backdrop-blur-sm pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono text-green-600 pointer-events-none z-10 font-semibold'>
        <span className='font-bold'>CIRCULAR</span>
        <span>tamanho: <b>{lista.length}</b></span>
        <span>cabeça: <b>{lista.length > 0 ? lista[0] : 'NULL'}</b></span>
        <span>cauda: <b>{lista.length > 0 ? lista[lista.length - 1] : 'NULL'}</b></span>
      </div>

      <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <PalcoZoom width={larguraCena} height={altura || 400}>
          <Layer>
            <Rect x={-5000} y={-5000} width={larguraCena + 10000} height={(altura || 400) + 10000} fill='#ffffff' />

            <Text x={INICIO_X} y={INICIO_Y - 32} text='CABEÇA' fontSize={9}
              fontFamily='monospace' fontStyle='bold' fill='#f5c518' letterSpacing={2} />
            <Rect x={INICIO_X} y={INICIO_Y - 20} width={2} height={12} fill='#f5c518' opacity={0.5} />

            {nosRenderizados.map((n) => {
              const id     = `${n.valor}_${n.indice}`;
              const xPos   = INICIO_X + n.indice * (LARGURA_NO + ESPACO_NO);
              const estado = nosNovos.has(id) ? 'novo' : nosRemovendo.has(id) ? 'removendo' : 'normal';
              return (
                <NoLista key={id}
                  x={xPos} y={INICIO_Y}
                  valor={n.valor} indice={n.indice}
                  destacado={indiceSobre === n.indice}
                  estado={estado}
                  aoPassar={setIndiceSobre}
                  aoSair={() => setIndiceSobre(null)} />
              );
            })}

            {/* Setas entre nós */}
            {nosRenderizados.map((_, i) => {
              if (i >= nosRenderizados.length - 1) return null;
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

            {/* Seta circular (último → primeiro) */}
            {nosRenderizados.length > 1 && (() => {
              const ultimoX  = INICIO_X + (nosRenderizados.length - 1) * (LARGURA_NO + ESPACO_NO) + LARGURA_NO;
              const ultimoY  = INICIO_Y + ALTURA_NO / 2;
              const primeiroX = INICIO_X;
              const primeiroY = INICIO_Y + ALTURA_NO / 2;
              return (
                <>
                  <Line
                    points={[
                      ultimoX + 4, ultimoY,
                      ultimoX + 40, ultimoY - 60,
                      primeiroX - 40, primeiroY - 60,
                      primeiroX - 4, primeiroY,
                    ]}
                    stroke='#10b981' strokeWidth={2} tension={0.5} bezier />
                  <Arrow
                    points={[primeiroX - 12, primeiroY - 8, primeiroX - 4, primeiroY]}
                    stroke='#10b981' strokeWidth={2} fill='#10b981'
                    pointerLength={7} pointerWidth={5} />
                </>
              );
            })()}

            {lista.length === 0 && nosRenderizados.length === 0 && (
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