import { useState, useRef, useEffect, useCallback } from 'react';
import { Layer, Rect, Text, Arrow, Group } from 'react-konva';
import Konva from 'konva';
import { visualizarFila, adicionarFila, removerFila } from '../../services/filaservices';
import PalcoZoom from './PalcoZoom';

const LARGURA_NO   = 82;
const ALTURA_NO    = 58;
const ESPACO_NO    = 46;
const INICIO_X     = 50;
const INICIO_Y     = 90;
const DURACAO_ANIM = 0.55;

function NoFila({ x, y, valor, indice, ehFrente, ehFundo, estado }) {
  const ref      = useRef();
  const especial = ehFrente || ehFundo;
  const cor      = ehFrente ? '#34d399' : ehFundo ? '#38bdf8' : null;

  // Inserção: entra pela direita
  useEffect(() => {
    if (!ref.current || estado !== 'novo') return;
    ref.current.x(x + 100);
    ref.current.opacity(0);
    ref.current.scaleX(0.6);
    ref.current.scaleY(0.6);
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      x,
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.EaseOut,
    }).play();
  }, [estado, x]);

  // Remoção: sai pela esquerda
  useEffect(() => {
    if (!ref.current || estado !== 'removendo') return;
    new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      x: x - 100,
      opacity: 0,
      scaleX: 0.6,
      scaleY: 0.6,
      easing: Konva.Easings.EaseIn,
    }).play();
  }, [estado, x]);

  return (
    <Group ref={ref} x={x} y={y}>
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
  const [fila, setFila]               = useState([]);
  const [nosRenderizados, setNosRend] = useState([]);
  const [novoValorFundo, setNovoVal]  = useState(null);
  const [removendoFrente, setRemov]   = useState(null);
  const [mensagem, setMensagem]       = useState(null);
  const refContainer                  = useRef(null);
  const [largura, setLargura]         = useState(600);
  const [altura, setAltura]           = useState(300);
  const animandoRef                   = useRef(false);

  const carregar = useCallback(async () => {
    if (animandoRef.current) return;
    try { const r = await visualizarFila(); setFila(r.data || []); }
    catch { setFila([]); }
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

  // Detecta mudanças: novo no fundo ou removido da frente
  useEffect(() => {
    const novosValores = new Set(fila);
    const antigosValores = new Set(nosRenderizados.map(n => n.valor));

    // Novo (adicionado ao fundo = último da fila atual)
    const inseridos = fila.filter((v, i) => i === fila.length - 1 && !antigosValores.has(v));
    // Removido (estava na frente = primeiro da lista anterior)
    const removidos = nosRenderizados.filter((n) => n.indice === 0 && !novosValores.has(n.valor));

    if (inseridos.length > 0) {
      setNovoVal(inseridos[0]);
      setTimeout(() => setNovoVal(null), DURACAO_ANIM * 1000 + 100);
    }

    if (removidos.length > 0) {
      animandoRef.current = true;
      setRemov(removidos[0].valor);
      setTimeout(() => {
        animandoRef.current = false;
        setNosRend(fila.map((v, i) => ({ valor: v, indice: i })));
        setRemov(null);
      }, DURACAO_ANIM * 1000 + 100);
    } else {
      setNosRend(fila.map((v, i) => ({ valor: v, indice: i })));
    }
  }, [fila]);

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

  const larguraTotal = nosRenderizados.length * (LARGURA_NO + ESPACO_NO) + 80 + INICIO_X;
  const larguraCena  = Math.max(largura, larguraTotal);

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 pointer-events-none'>
          {mensagem.texto}
        </div>
      )}

      <div className='absolute top-3 left-4 right-4 flex justify-between text-[9px] font-mono font-bold pointer-events-none z-10 text-green-600'>
        <span>← DESENFILEIRAR (FRENTE)</span>
        <span>ENFILEIRAR (FUNDO) →</span>
      </div>

      <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <PalcoZoom width={larguraCena} height={altura || 300}>
          <Layer>
            <Rect x={-5000} y={-5000} width={larguraCena + 10000} height={(altura || 300) + 10000} fill='#ffffff' />

            {nosRenderizados.length === 0 && (
              <Text x={0} y={(altura || 300) / 2 - 10} width={larguraCena}
                text='Fila vazia — use o painel para inserir'
                fontSize={12} fontFamily='monospace' fill='#334155' align='center' />
            )}

            {nosRenderizados.map((n, idx) => {
              const xPos    = INICIO_X + idx * (LARGURA_NO + ESPACO_NO);
              const ehFrente = idx === 0;
              const ehFundo  = idx === nosRenderizados.length - 1 && nosRenderizados.length > 1;
              // Só anima: novo no fundo OU removido da frente
              let estado = 'normal';
              if (ehFundo && n.valor === novoValorFundo)      estado = 'novo';
              if (ehFrente && n.valor === removendoFrente)    estado = 'removendo';
              return (
                <NoFila
                  key={`${n.valor}_${idx}`}
                  x={xPos} y={INICIO_Y}
                  valor={n.valor} indice={idx}
                  ehFrente={ehFrente}
                  ehFundo={ehFundo}
                  estado={estado} />
              );
            })}

            {/* Setas entre nós */}
            {nosRenderizados.map((_, i) => {
              if (i >= nosRenderizados.length - 1) return null;
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
            {nosRenderizados.length > 0 && (() => {
              const rx = INICIO_X + nosRenderizados.length * (LARGURA_NO + ESPACO_NO) - ESPACO_NO + LARGURA_NO;
              return (
                <Arrow points={[rx + 8, INICIO_Y + ALTURA_NO / 2, rx + 44, INICIO_Y + ALTURA_NO / 2]}
                  stroke='#38bdf8' strokeWidth={2} fill='#38bdf8' pointerLength={7} pointerWidth={5} />
              );
            })()}

            {/* Seta saída (esquerda) */}
            {nosRenderizados.length > 0 && (
              <Arrow points={[INICIO_X - 44, INICIO_Y + ALTURA_NO / 2, INICIO_X - 8, INICIO_Y + ALTURA_NO / 2]}
                stroke='#34d399' strokeWidth={2} fill='#34d399' pointerLength={7} pointerWidth={5} />
            )}
          </Layer>
        </PalcoZoom>
      </div>
    </div>
  );
}