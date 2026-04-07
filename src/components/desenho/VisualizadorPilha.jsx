import { useState, useRef, useEffect } from 'react';
import { Layer, Rect, Text, Arrow, Group } from 'react-konva';
import { visualizarPilha, inserirPilha, removerPilha } from '../../services/pilhaServices';
import PalcoZoom from './PalcoZoom';

const LARGURA_NO  = 150;
const ALTURA_NO   = 48;
const ESPACO_NO   = 5;

function NoPilha({ x, y, valor, indice, ehTopo }) {
  return (
    <Group x={x} y={y}>
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
  const [pilha, setPilha]         = useState([]);
  const [mensagem, setMensagem]   = useState(null);
  const refContainer              = useRef(null);
  const [largura, setLargura]     = useState(400);
  const [altura, setAltura]       = useState(500);

  const carregar = async () => {
    try { const r = await visualizarPilha(); setPilha(r.data || []); }
    catch { setPilha([]); }
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
        try { await inserirPilha(val); setTimeout(() => carregar(), 300); avisar(`PUSH ${val}`); }
        catch { avisar('Erro ao inserir!', '#ff4466'); }
      },
      remover: async () => {
        if (pilha.length === 0) return avisar('Pilha vazia!', '#ff4466');
        try { await removerPilha(); setTimeout(() => carregar(), 300); avisar('POP executado'); }
        catch { avisar('Erro ao remover!', '#ff4466'); }
      },
    });
  }, [pilha]);

  const xNo   = (largura - LARGURA_NO) / 2;
  const baseY = altura - 60;

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      {/* Info - fixa */}
      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono text-green-600 pointer-events-none z-10 font-semibold'>
        <span>LIFO</span>
        <span>tamanho: <b>{pilha.length}</b></span>
        <span>topo: <b>{pilha.length > 0 ? pilha[pilha.length - 1] : '—'}</b></span>
      </div>

      <PalcoZoom width={largura} height={altura}>
        <Layer>
          {/* Fundo branco expandido */}
          <Rect x={-5000} y={-5000} width={largura + 10000} height={altura + 10000} fill='#ffffff' />
          {/* Base */}
          <Rect x={xNo - 12} y={baseY + 12} width={LARGURA_NO + 24} height={7}
            cornerRadius={3} fill='#94a3b8' />

          {pilha.length === 0 && (
            <Text x={0} y={altura / 2 - 10} width={largura}
              text='Pilha vazia — use o painel para inserir'
              fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
          )}

          {pilha.map((val, i) => {
            const y     = baseY - (i + 1) * (ALTURA_NO + ESPACO_NO);
            const ehTopo = i === pilha.length - 1;
            return <NoPilha key={i} x={xNo} y={y} valor={val} indice={i} ehTopo={ehTopo} />;
          })}

          {/* Seta TOPO */}
          {pilha.length > 0 && (() => {
            const ty = baseY - pilha.length * (ALTURA_NO + ESPACO_NO);
            return (
              <>
                <Arrow points={[xNo - 48, ty + ALTURA_NO / 2, xNo - 8, ty + ALTURA_NO / 2]}
                  stroke='#a78bfa' strokeWidth={2} fill='#a78bfa' pointerLength={7} pointerWidth={5} />
                <Text x={xNo - 96} y={ty + ALTURA_NO / 2 - 7}
                  text='TOPO' fontSize={9} fontFamily='monospace' fontStyle='bold' fill='#a78bfa' />
              </>
            );
          })()}
        </Layer>
      </PalcoZoom>
    </div>
  );
}
