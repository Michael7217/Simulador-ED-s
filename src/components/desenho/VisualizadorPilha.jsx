import { useState, useRef, useEffect, useCallback } from 'react';
import { Layer, Rect, Text, Arrow, Group } from 'react-konva';
import Konva from 'konva';
import { visualizarPilha, inserirPilha, removerPilha } from '../../services/pilhaServices';
import PalcoZoom from './PalcoZoom';

const LARGURA_NO   = 150;
const ALTURA_NO    = 48;
const ESPACO_NO    = 5;
const DURACAO_ANIM = 0.55;

// ─── Nó da pilha — só anima quando é novo ou está sendo removido ──────────
function NoPilha({ x, y, valor, indice, ehTopo, estado }) {
  const ref = useRef();

  // Animação de entrada: cai de cima
  useEffect(() => {
    if (!ref.current || estado !== 'novo') return;
    ref.current.y(y - 64);
    ref.current.opacity(0);
    ref.current.scaleX(0.7);
    ref.current.scaleY(0.7);
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      opacity: 1,
      y,
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.EaseOut,
    }).play();
  }, [estado, y]);

  // Animação de saída: sobe e some
  useEffect(() => {
    if (!ref.current || estado !== 'removendo') return;
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      opacity: 0,
      y: y - 72,
      scaleX: 0.6,
      scaleY: 0.6,
      easing: Konva.Easings.EaseIn,
    }).play();
  }, [estado, y]);

  return (
    <Group ref={ref} x={x} y={y}>
      {ehTopo && (
        <Rect x={-4} y={-4} width={LARGURA_NO + 8} height={ALTURA_NO + 8} cornerRadius={9}
          fill='transparent' stroke='#a78bfa' strokeWidth={2} opacity={0.5}
          shadowColor='#a78bfa' shadowBlur={18} shadowOpacity={0.7} />
      )}
      <Rect width={LARGURA_NO} height={ALTURA_NO} cornerRadius={6}
        fill={ehTopo ? '#ede9fe' : '#f1f5f9'}
        stroke={ehTopo ? '#a78bfa' : '#64748b'}
        strokeWidth={ehTopo ? 2 : 1} />
      <Text x={0} y={0} width={LARGURA_NO - 50} height={ALTURA_NO}
        text={String(valor)} fontSize={16} fontFamily='monospace' fontStyle='bold'
        fill={ehTopo ? '#7c3aed' : '#1e293b'} align='center' verticalAlign='middle' />
      <Rect x={LARGURA_NO - 46} y={12} width={38} height={22} cornerRadius={4}
        fill={ehTopo ? '#a78bfa' : '#cbd5e1'} opacity={0.8} />
      <Text x={LARGURA_NO - 46} y={12} width={38} height={22}
        text={ehTopo ? 'TOPO' : `[${indice}]`}
        fontSize={9} fontFamily='monospace' fontStyle='bold'
        fill={ehTopo ? '#fff' : '#475569'} align='center' verticalAlign='middle' />
    </Group>
  );
}

export default function PilhaVisualizer({ onAcoes }) {
  const [pilha, setPilha]             = useState([]);
  const [nosRenderizados, setNosRend] = useState([]);
  const [novoValorTopo, setNovoValor] = useState(null);
  const [removendoTopo, setRemovendo] = useState(null);
  const [mensagem, setMensagem]       = useState(null);
  const refContainer                  = useRef(null);
  const [largura, setLargura]         = useState(400);
  const [altura, setAltura]           = useState(500);
  const animandoRef                   = useRef(false);

  const carregar = useCallback(async () => {
    if (animandoRef.current) return;
    try { const r = await visualizarPilha(); setPilha(r.data || []); }
    catch { setPilha([]); }
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

  // Detecta mudanças: compara valores (não índices)
  useEffect(() => {
    const novosValores = new Set(pilha);
    const antigosValores = new Set(nosRenderizados.map(n => n.valor));

    const inseridos = pilha.filter((v, i) => i === 0 && !antigosValores.has(v));
    const removidos = nosRenderizados.filter((n) => n.indice === 0 && !novosValores.has(n.valor));

    if (inseridos.length > 0) {
      setNovoValor(inseridos[0]);
      setTimeout(() => setNovoValor(null), DURACAO_ANIM * 1000 + 100);
    }

    if (removidos.length > 0) {
      animandoRef.current = true;
      setRemovendo(removidos[0].valor);
      setTimeout(() => {
        animandoRef.current = false;
        setNosRend(pilha.map((v, i) => ({ valor: v, indice: i })));
        setRemovendo(null);
      }, DURACAO_ANIM * 1000 + 100);
    } else {
      setNosRend(pilha.map((v, i) => ({ valor: v, indice: i })));
    }
  }, [pilha]);

  const avisar = (texto, cor = '#00e676') => {
    setMensagem({ texto, cor });
    setTimeout(() => setMensagem(null), 2500);
  };

  useEffect(() => {
    onAcoes?.({
      inserir: async (valor) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar('Valor inválido!', '#ff4466');
        try { await inserirPilha(val); setTimeout(() => carregar(), 300); avisar(`Empilhado ${val}`); }
        catch { avisar('Erro ao inserir!', '#ff4466'); }
      },
      remover: async () => {
        if (pilha.length === 0) return avisar('Pilha vazia!', '#ff4466');
        try { await removerPilha(); setTimeout(() => carregar(), 300); avisar('Desempilhado'); }
        catch { avisar('Erro ao remover!', '#ff4466'); }
      },
    });
  }, [pilha]);

  const xNo   = (largura - LARGURA_NO) / 2;
  const baseY = altura - 60;

  // y = baseY - (tamanho - índice) * (altura + espaço)
  // índice 0 fica no topo (y mais alto)
  const topoY = nosRenderizados.length > 0
    ? baseY - nosRenderizados.length * (ALTURA_NO + ESPACO_NO)
    : null;
  const setaY        = topoY !== null ? topoY + ALTURA_NO / 2 : 0;
  const setaXFim     = xNo - 8;
  const setaXInicio  = xNo - 62;

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono text-green-600 pointer-events-none z-10 font-semibold'>
        <span>LIFO</span>
        <span>tamanho: <b>{pilha.length}</b></span>
        <span>topo: <b>{pilha.length > 0 ? pilha[0] : '—'}</b></span>
      </div>

      <PalcoZoom width={largura} height={altura}>
        <Layer>
          <Rect x={-5000} y={-5000} width={largura + 10000} height={altura + 10000} fill='#ffffff' />

          {/* Base da pilha */}
          <Rect x={xNo - 12} y={baseY + 12} width={LARGURA_NO + 24} height={7}
            cornerRadius={3} fill='#94a3b8' />

          {pilha.length === 0 && nosRenderizados.length === 0 && (
            <Text x={0} y={altura / 2 - 10} width={largura}
              text='Pilha vazia — use o painel para inserir'
              fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
          )}

          {nosRenderizados.map((n, idx) => {
            const y      = baseY - (nosRenderizados.length - idx) * (ALTURA_NO + ESPACO_NO);
            const ehTopo = idx === 0;
            // Só anima o nó do topo se for novo ou está sendo removido
            let estado = 'normal';
            if (ehTopo && n.valor === novoValorTopo)     estado = 'novo';
            if (ehTopo && n.valor === removendoTopo)     estado = 'removendo';
            return (
              <NoPilha
                key={`${n.valor}_${idx}`}
                x={xNo} y={y}
                valor={n.valor} indice={idx}
                ehTopo={ehTopo} estado={estado} />
            );
          })}

          {pilha.length > 0 && (
            <>
              <Text x={setaXInicio} y={setaY - 15}
                width={setaXFim - setaXInicio}
                text='TOPO' fontSize={9} fontFamily='monospace' fontStyle='bold'
                fill='#a78bfa' align='center' />
              <Arrow points={[setaXInicio, setaY, setaXFim, setaY]}
                stroke='#a78bfa' strokeWidth={2} fill='#a78bfa'
                pointerLength={7} pointerWidth={5} />
            </>
          )}
        </Layer>
      </PalcoZoom>
    </div>
  );
}