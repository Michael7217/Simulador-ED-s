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
const DURACAO_ANIM = 1.2;

// ─── Nó animado ─────────────────────────────────────────────────────────────
function NoLista({ valor, indice, destacado, estado, posAlvo, aoPassar, aoSair, onRemocaoCompleta }) {
  const ref = useRef();
  const prevPos = useRef(posAlvo);
  const animacaoRef = useRef(null);

  // Posicionamento inicial e animação de novo nó
  useEffect(() => {
    if (!ref.current) return;
    
    if (estado === 'novo') {
      ref.current.x(posAlvo.x);
      ref.current.y(posAlvo.y - 70);
      ref.current.opacity(0);
      ref.current.scaleX(0.5);
      ref.current.scaleY(0.5);
      new Konva.Tween({
        node: ref.current,
        duration: DURACAO_ANIM,
        y: posAlvo.y,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.BounceEaseOut,
      }).play();
    } else if (estado !== 'removendo') {
      ref.current.x(posAlvo.x);
      ref.current.y(posAlvo.y);
      ref.current.opacity(1);
      ref.current.scaleX(1);
      ref.current.scaleY(1);
    }
    
    prevPos.current = posAlvo;
  }, [estado, posAlvo]);

  // Animação de remoção suave
  useEffect(() => {
    if (!ref.current || estado !== 'removendo') return;
    
    if (animacaoRef.current) {
      animacaoRef.current.destroy();
    }
    
    // Animação de fade out + escala
    animacaoRef.current = new Konva.Tween({
      node: ref.current,
      duration: DURACAO_ANIM,
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
        if (onRemocaoCompleta) {
          onRemocaoCompleta(valor);
        }
      }
    }).play();
    
    return () => {
      if (animacaoRef.current) {
        animacaoRef.current.destroy();
      }
    };
  }, [estado, valor, onRemocaoCompleta]);

  // Movimento suave
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

  // Se está removendo, ainda renderiza (para a animação)
  return (
    <Group 
      ref={ref} 
      x={posAlvo.x} 
      y={posAlvo.y} 
      onMouseEnter={() => estado !== 'removendo' && aoPassar(indice)} 
      onMouseLeave={() => estado !== 'removendo' && aoSair()}
      opacity={estado === 'removendo' ? 1 : undefined}
    >
      {destacado && estado !== 'removendo' && (
        <Rect x={-3} y={-3} width={LARGURA_NO + 6} height={ALTURA_NO + 6}
          cornerRadius={RAIO_BORDA + 2} fill='transparent'
          stroke='#f5c518' strokeWidth={2} opacity={0.5}
          shadowColor='#f5c518' shadowBlur={16} shadowOpacity={0.6} />
      )}
      <Rect width={LARGURA_NO} height={ALTURA_NO} cornerRadius={RAIO_BORDA}
        fill={destacado && estado !== 'removendo' ? '#fef3c7' : '#f1f5f9'}
        stroke={destacado && estado !== 'removendo' ? '#f59e0b' : '#3b82f6'}
        strokeWidth={destacado && estado !== 'removendo' ? 2 : 1} />
      <Rect x={LARGURA_NO * 0.65} y={6} width={1} height={ALTURA_NO - 12}
        fill={destacado && estado !== 'removendo' ? '#f59e0b' : '#3b82f6'} opacity={0.7} />
      <Text x={0} y={0} width={LARGURA_NO * 0.65} height={ALTURA_NO}
        text={String(valor)} fontSize={16} fontFamily='monospace' fontStyle='bold'
        fill={destacado && estado !== 'removendo' ? '#d97706' : '#1e293b'} align='center' verticalAlign='middle' />
      <Text x={LARGURA_NO * 0.65} y={0} width={LARGURA_NO * 0.35} height={ALTURA_NO}
        text='→' fontSize={13} fontFamily='monospace'
        fill={destacado && estado !== 'removendo' ? '#f59e0b' : '#3b82f6'} align='center' verticalAlign='middle' />
      <Rect x={-8} y={-8} width={18} height={18} cornerRadius={9}
        fill={destacado && estado !== 'removendo' ? '#f59e0b' : '#3b82f6'} />
      <Text x={-8} y={-8} width={18} height={18} text={String(indice)}
        fontSize={9} fontFamily='monospace' fontStyle='bold'
        fill='#fff' align='center' verticalAlign='middle' />
    </Group>
  );
}

// ─── Aresta animada ──────────────────────────────────────────────────────────
function ArestaAnimada({ posAlvoInicio, posAlvoFim, destaque, visivel }) {
  const ref = useRef();
  const prevInicio = useRef(posAlvoInicio);
  const prevFim = useRef(posAlvoFim);

  useEffect(() => {
    if (!ref.current || !visivel) return;
    ref.current.points([posAlvoInicio.x + LARGURA_NO, posAlvoInicio.y + ALTURA_NO / 2, posAlvoFim.x, posAlvoFim.y + ALTURA_NO / 2]);
    prevInicio.current = posAlvoInicio;
    prevFim.current = posAlvoFim;
  }, [visivel]);

  useEffect(() => {
    if (!ref.current || !visivel) return;
    
    const startI = { ...prevInicio.current };
    const startF = { ...prevFim.current };
    const endI = posAlvoInicio;
    const endF = posAlvoFim;

    const moveu = Math.abs(endI.x - startI.x) > 0.5 || Math.abs(endI.y - startI.y) > 0.5 ||
                  Math.abs(endF.x - startF.x) > 0.5 || Math.abs(endF.y - startF.y) > 0.5;
    if (!moveu) return;

    const startTime = performance.now();
    const dur = DURACAO_ANIM * 1000;

    const tick = (now) => {
      const t = Math.min((now - startTime) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      if (!ref.current) return;
      ref.current.points([
        startI.x + (endI.x - startI.x) * ease + LARGURA_NO,
        startI.y + (endI.y - startI.y) * ease + ALTURA_NO / 2,
        startF.x + (endF.x - startF.x) * ease,
        startF.y + (endF.y - startF.y) * ease + ALTURA_NO / 2,
      ]);
      ref.current.getLayer()?.batchDraw();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    prevInicio.current = posAlvoInicio;
    prevFim.current = posAlvoFim;
  }, [posAlvoInicio.x, posAlvoInicio.y, posAlvoFim.x, posAlvoFim.y, visivel]);

  if (!visivel) return null;

  return (
    <Arrow
      ref={ref}
      points={[posAlvoInicio.x + LARGURA_NO, posAlvoInicio.y + ALTURA_NO / 2, posAlvoFim.x, posAlvoFim.y + ALTURA_NO / 2]}
      stroke={destaque ? '#f59e0b' : '#3b82f6'}
      strokeWidth={destaque ? 2 : 1.5}
      fill={destaque ? '#f59e0b' : '#3b82f6'}
      pointerLength={7}
      pointerWidth={5}
    />
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function ListaVisualizer({ onAcoes }) {
  const [lista, setLista] = useState([]);
  const [nosMap, setNosMap] = useState({});
  const [indiceSobre, setIndiceSobre] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const refContainer = useRef(null);
  const [largura, setLargura] = useState(600);
  const [altura, setAltura] = useState(400);
  const animandoRef = useRef(false);
  const [versao, setVersao] = useState(0);

  const carregar = useCallback(async () => {
    if (animandoRef.current) return;
    try {
      const r = await visualizarLista();
      setLista(r.data || []);
      setVersao(v => v + 1);
    } catch {
      setLista([]);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, []);

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

  const calcPosAlvo = (indice) => ({
    x: INICIO_X + indice * (LARGURA_NO + ESPACO_NO),
    y: INICIO_Y,
  });

  const handleRemocaoCompleta = useCallback((valorRemovido) => {
    // Remove o nó do mapa após a animação
    setNosMap(prev => {
      const next = { ...prev };
      delete next[valorRemovido];
      return next;
    });
    
    // Reposiciona os nós restantes
    const novosValores = lista.filter(v => v !== valorRemovido);
    setNosMap(prev => {
      const next = { ...prev };
      novosValores.forEach((v, i) => {
        if (next[v]) {
          next[v] = {
            ...next[v],
            indice: i,
            posAlvo: calcPosAlvo(i),
            estado: 'movendo',
          };
        }
      });
      return { ...next };
    });
    
    // Limpa o estado 'movendo'
    setTimeout(() => {
      setNosMap(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (next[key].estado === 'movendo') {
            next[key] = { ...next[key], estado: 'normal' };
          }
        });
        return next;
      });
      animandoRef.current = false;
    }, DURACAO_ANIM * 1000);
  }, [lista]);

  // Gerencia animações
  useEffect(() => {
    if (Object.keys(nosMap).length === 0 && lista.length === 0) return;
    
    if (Object.keys(nosMap).length === 0 && lista.length > 0) {
      // Primeira carga
      const novoMapa = {};
      lista.forEach((v, i) => {
        novoMapa[v] = {
          valor: v,
          indice: i,
          posAlvo: calcPosAlvo(i),
          estado: 'novo',
        };
      });
      setNosMap(novoMapa);
      setTimeout(() => {
        setNosMap(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => {
            if (next[key].estado === 'novo') {
              next[key] = { ...next[key], estado: 'normal' };
            }
          });
          return next;
        });
      }, DURACAO_ANIM * 1000);
      return;
    }

    // Encontrar nós removidos
    const valoresAtuais = new Set(lista);
    const removidos = Object.values(nosMap).filter(n => !valoresAtuais.has(n.valor) && n.estado !== 'removendo');
    
    // Encontrar nós inseridos
    const inseridos = lista.filter(v => !nosMap[v]);

    if (removidos.length > 0 && !animandoRef.current) {
      animandoRef.current = true;
      
      // Marcar nós para remoção
      setNosMap(prev => {
        const next = { ...prev };
        removidos.forEach(r => {
          if (next[r.valor]) {
            next[r.valor] = { ...next[r.valor], estado: 'removendo' };
          }
        });
        return next;
      });
      
      // As arestas vão se ajustar automaticamente
    } else if (inseridos.length > 0 && !animandoRef.current) {
      animandoRef.current = true;
      
      // Mover nós existentes se necessário
      setNosMap(prev => {
        const next = { ...prev };
        lista.forEach((v, i) => {
          if (next[v] && next[v].estado !== 'removendo' && next[v].estado !== 'novo') {
            next[v] = {
              ...next[v],
              indice: i,
              posAlvo: calcPosAlvo(i),
              estado: 'movendo',
            };
          }
        });
        return { ...next };
      });
      
      // Adicionar novos nós
      setTimeout(() => {
        setNosMap(prev => {
          const next = { ...prev };
          inseridos.forEach(v => {
            const posEncontrada = lista.findIndex(val => val === v);
            next[v] = {
              valor: v,
              indice: posEncontrada,
              posAlvo: calcPosAlvo(posEncontrada),
              estado: 'novo',
            };
          });
          return { ...next };
        });
        
        // Limpar estados
        setTimeout(() => {
          setNosMap(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(key => {
              if (next[key].estado === 'movendo' || next[key].estado === 'novo') {
                next[key] = { ...next[key], estado: 'normal' };
              }
            });
            return next;
          });
          animandoRef.current = false;
        }, DURACAO_ANIM * 1000);
      }, DURACAO_ANIM * 1000);
    }
  }, [lista, versao]);

  useEffect(() => {
    onAcoes?.({
      inserir: async (valor, pos) => {
        const val = parseInt(valor);
        if (isNaN(val)) return avisar('Valor inválido!', '#ff4466');
        try {
          if (pos === 'inicio') {
            await adicionarListaInicio(val);
            avisar(`Inserido ${val} no início`);
          } else if (pos === 'meio') {
            await adicionarListaMeio(val);
            avisar(`Inserido ${val} no meio`);
          } else if (pos === 'fim') {
            await adicionarListaFim(val);
            avisar(`Inserido ${val} no fim`);
          } else if (pos === '' || pos === undefined || pos === null) {
            await adicionarListaOrdenado(val);
            avisar(`Inserido ${val} (ordenado)`);
          } else {
            const p = parseInt(pos);
            if (isNaN(p) || p < 0 || p > lista.length)
              return avisar(`Posição inválida (0–${lista.length})`, '#ff4466');
            const posicaoMeio = Math.floor(lista.length / 2);
            if (p === 0) {
              await adicionarListaInicio(val);
              avisar(`Inserido ${val} no início`);
            } else if (p === lista.length) {
              await adicionarListaFim(val);
              avisar(`Inserido ${val} no fim`);
            } else if (p === posicaoMeio) {
              await adicionarListaMeio(val);
              avisar(`Inserido ${val} no meio`);
            }
          }
          setTimeout(() => carregar(), 300);
        } catch {
          avisar('Erro ao inserir!', '#ff4466');
        }
      },
      remover: async (valor) => {
        const val = parseInt(valor);
        if (!isNaN(val)) {
          try {
            await removerListaOrdenado(val);
            setTimeout(() => carregar(), 300);
            avisar(`Removido ${val}`);
            return;
          } catch {
            /* fallback */
          }
        }
        const pos = parseInt(valor);
        if (isNaN(pos) || pos < 0 || pos >= lista.length)
          return avisar(`Índice inválido (0–${lista.length - 1})`, '#ff4466');
        try {
          await removerListaPosicao(pos);
          setTimeout(() => carregar(), 300);
          avisar(`Removida pos. ${pos}`);
        } catch {
          avisar('Erro ao remover!', '#ff4466');
        }
      },
    });
  }, [lista]);

  const nosLista = Object.values(nosMap);
  const larguraTotal = nosLista.length * (LARGURA_NO + ESPACO_NO) + 48 + INICIO_X * 2;
  const larguraCena = Math.max(largura, larguraTotal);

  return (
    <div ref={refContainer} className='relative w-full h-full'>
      {mensagem && (
        <div
          style={{ borderColor: mensagem.cor, color: mensagem.cor }}
          className='absolute top-3 left-1/2 -translate-x-1/2 z-10 border rounded-lg px-4 py-1 text-xs font-mono font-bold bg-black/70 backdrop-blur-sm pointer-events-none'
        >
          {mensagem.texto}
        </div>
      )}

      <div className='absolute top-3 left-4 flex gap-3 text-[10px] font-mono text-green-600 pointer-events-none z-10 font-semibold'>
        <span className='font-bold'>CIRCULAR</span>
        <span>
          tamanho: <b>{lista.length}</b>
        </span>
        <span>
          início: <b>{lista.length > 0 ? lista[0] : 'NULL'}</b>
        </span>
        <span>
          fim: <b>{lista.length > 0 ? lista[lista.length - 1] : 'NULL'}</b>
        </span>
      </div>

      <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <PalcoZoom width={larguraCena} height={altura || 400}>
          <Layer>
            <Rect
              x={-5000}
              y={-5000}
              width={larguraCena + 10000}
              height={(altura || 400) + 10000}
              fill='#ffffff'
            />

            <Text
              x={INICIO_X}
              y={INICIO_Y - 32}
              text='CABEÇA'
              fontSize={9}
              fontFamily='monospace'
              fontStyle='bold'
              fill='#f5c518'
              letterSpacing={2}
            />
            <Rect x={INICIO_X} y={INICIO_Y - 20} width={2} height={12} fill='#f5c518' opacity={0.5} />

            {/* Arestas entre nós consecutivos */}
            {nosLista.map((n, i) => {
              if (i >= nosLista.length - 1) return null;
              const proximoNo = nosLista[i + 1];
              if (!proximoNo) return null;
              const destaque = indiceSobre === n.indice || indiceSobre === proximoNo.indice;
              const ambosVisiveis = n.estado !== 'removendo' && proximoNo.estado !== 'removendo';
              return (
                <ArestaAnimada
                  key={`aresta_${n.valor}_${proximoNo.valor}`}
                  posAlvoInicio={n.posAlvo}
                  posAlvoFim={proximoNo.posAlvo}
                  destaque={destaque}
                  visivel={ambosVisiveis}
                />
              );
            })}

            {/* Aresta circular */}
            {nosLista.length > 1 &&
              (() => {
                const ultimo = nosLista[nosLista.length - 1];
                const primeiro = nosLista[0];
                const ambosVisiveis = ultimo.estado !== 'removendo' && primeiro.estado !== 'removendo';
                if (!ambosVisiveis) return null;

                const ultimoX = ultimo.posAlvo.x + LARGURA_NO;
                const ultimoY = ultimo.posAlvo.y + ALTURA_NO / 2;
                const primeiroX = primeiro.posAlvo.x;
                const primeiroY = primeiro.posAlvo.y + ALTURA_NO / 2;
                return (
                  <>
                    <Line
                      points={[
                        ultimoX + 4,
                        ultimoY,
                        ultimoX + 40,
                        ultimoY - 60,
                        primeiroX - 40,
                        primeiroY - 60,
                        primeiroX - 4,
                        primeiroY,
                      ]}
                      stroke='#10b981'
                      strokeWidth={2}
                      tension={0.5}
                      bezier
                    />
                    <Arrow
                      points={[primeiroX - 12, primeiroY - 8, primeiroX - 4, primeiroY]}
                      stroke='#10b981'
                      strokeWidth={2}
                      fill='#10b981'
                      pointerLength={7}
                      pointerWidth={5}
                    />
                  </>
                );
              })()}

            {/* Nós animados */}
            {nosLista.map((n) => (
              <NoLista
                key={`no_${n.valor}`}
                valor={n.valor}
                indice={n.indice}
                destacado={indiceSobre === n.indice}
                estado={n.estado}
                posAlvo={n.posAlvo}
                aoPassar={setIndiceSobre}
                aoSair={() => setIndiceSobre(null)}
                onRemocaoCompleta={handleRemocaoCompleta}
              />
            ))}

            {lista.length === 0 && nosLista.length === 0 && (
              <Text
                x={0}
                y={(altura || 400) / 2 - 10}
                width={larguraCena}
                text='Lista vazia — use o painel para inserir'
                fontSize={12}
                fontFamily='monospace'
                fill='#334155'
                align='center'
              />
            )}
          </Layer>
        </PalcoZoom>
      </div>
    </div>
  );
}