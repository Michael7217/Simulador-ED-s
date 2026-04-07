import { useState, useRef, useEffect } from 'react';
import { Layer, Rect, Text, Arrow, Group } from 'react-konva';
import { visualizarFila, adicionarFila, removerFila } from '../../services/filaservices';
import PalcoZoom from './PalcoZoom';

const LARGURA_NO = 82;
const ALTURA_NO  = 58;
const ESPACO_NO  = 46;
const INICIO_X   = 50;
const INICIO_Y   = 90;

function NoFila({ x, y, valor, indice, ehFrente, ehFundo }) {
  const especial = ehFrente || ehFundo;
  const cor      = ehFrente ? '#34d399' : ehFundo ? '#38bdf8' : null;
  return (
    <Group x={x} y={y}>
      {especial && (
        <Rect x={-3} y={-3} width={LARGURA_NO + 6} height={ALTURA_NO + 6} cornerRadius={9}
          fill='transparent' stroke={cor} strokeWidth={1.5} opacity={0.35}
          shadowColor={cor} shadowBlur={12} shadowOpacity={0.5} />
      )}
      <Rect width={LARGURA_NO} height={ALTURA_NO} cornerRadius={6}
        fill={ehFrente ? '#dcfce7' : ehFundo ? '#dbeafe' : '#f1f5f9'}
        stroke={especial ? cor : '#3b82f6'} strokeWidth={especial ? 2 : 1} />
      <Text x={0} y={0} width={LARGURA_NO} height={ALTURA_NO - 16}
        text={String(valor)} fontSize={17} fontFamily='monospace' fontStyle='bold'
        fill={especial ? (ehFrente ? '#059669' : '#0284c7') : '#1e293b'} align='center' verticalAlign='middle' />
      <Text x={0} y={ALTURA_NO - 16} width={LARGURA_NO} height={16}
        text={ehFrente ? 'FRENTE' : ehFundo ? 'FUNDO' : `[${indice}]`}
        fontSize={8} fontFamily='monospace' fontStyle='bold'
        fill={especial ? (ehFrente ? '#059669' : '#0284c7') : '#64748b'} align='center' verticalAlign='middle' />
    </Group>
  );
}

export default function FilaVisualizer({ onAcoes }) {
  const [fila, setFila]           = useState([]);
  const [mensagem, setMensagem]   = useState(null);
  const refContainer              = useRef(null);
  const [largura, setLargura]     = useState(600);
  const [altura, setAltura]       = useState(300);

  const carregar = async () => {
    try { const r = await visualizarFila(); setFila(r.data || []); }
    catch { setFila([]); }
  };

  useEffect(() => { carregar(); }, []);

  // Recarrega periodicamente para pegar mudanças
  useEffect(() => {
    const interval = setInterval(() => {
      carregar();
    }, 2000); // Recarrega a cada 2 segundos
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
        try { await adicionarFila(val); setTimeout(() => carregar(), 300); avisar(`Enfileirado ${val}`); }
        catch { avisar('Erro ao inserir!', '#ff4466'); }
      },
      remover: async () => {
        if (fila.length === 0) return avisar('Fila vazia!', '#ff4466');
        try { await removerFila(); setTimeout(() => carregar(), 300); avisar('Desenfileirado'); }
        catch { avisar('Erro ao remover!', '#ff4466'); }
      },
    });
  }, [fila]);

  const larguraTotal = fila.length * (LARGURA_NO + ESPACO_NO) + 80 + INICIO_X;
  const larguraCena  = Math.max(largura, larguraTotal);

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      {/* Labels direcionais - fixos */}
      <div className='absolute top-3 left-4 right-4 flex justify-between text-[9px] font-mono font-bold pointer-events-none z-10 text-green-600'>
        <span>← DESENFILEIRAR (FRENTE)</span>
        <span>ENFILEIRAR (FUNDO) →</span>
      </div>

      <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <PalcoZoom width={larguraCena} height={altura || 300}>
          <Layer>
            {/* Fundo branco expandido */}
            <Rect x={-5000} y={-5000} width={larguraCena + 10000} height={(altura || 300) + 10000} fill='#ffffff' />
            {fila.length === 0 && (
              <Text x={0} y={(altura || 300) / 2 - 10} width={larguraCena}
                text='Fila vazia — use o painel para inserir'
                fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
            )}
            {fila.map((val, i) => (
              <NoFila key={i}
                x={INICIO_X + i * (LARGURA_NO + ESPACO_NO)} y={INICIO_Y}
                valor={val} indice={i}
                ehFrente={i === 0}
                ehFundo={i === fila.length - 1 && fila.length > 1} />
            ))}
            {fila.map((_, i) => {
              if (i >= fila.length - 1) return null;
              const x1 = INICIO_X + i * (LARGURA_NO + ESPACO_NO) + LARGURA_NO;
              const x2 = INICIO_X + (i + 1) * (LARGURA_NO + ESPACO_NO);
              const y  = INICIO_Y + ALTURA_NO / 2;
              return (
                <Arrow key={`s${i}`} points={[x1 + 4, y, x2 - 4, y]}
                  stroke='#3b82f6' strokeWidth={1.5} fill='#3b82f6'
                  pointerLength={7} pointerWidth={5} />
              );
            })}
            {/* Seta entrada (direita) */}
            {fila.length > 0 && (() => {
              const rx = INICIO_X + fila.length * (LARGURA_NO + ESPACO_NO) - ESPACO_NO + LARGURA_NO;
              return (
                <Arrow points={[rx + 8, INICIO_Y + ALTURA_NO / 2, rx + 44, INICIO_Y + ALTURA_NO / 2]}
                  stroke='#38bdf8' strokeWidth={2} fill='#38bdf8' pointerLength={7} pointerWidth={5} />
              );
            })()}
            {/* Seta saída (esquerda) */}
            {fila.length > 0 && (
              <Arrow points={[INICIO_X - 44, INICIO_Y + ALTURA_NO / 2, INICIO_X - 8, INICIO_Y + ALTURA_NO / 2]}
                stroke='#34d399' strokeWidth={2} fill='#34d399' pointerLength={7} pointerWidth={5} />
            )}
          </Layer>
        </PalcoZoom>
      </div>
    </div>
  );
}
