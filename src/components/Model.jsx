import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import * as filaServices from '../services/filaservices'
import * as pilhaServices from '../services/pilhaServices'
import * as listaServices from '../services/listaservices'
import * as abbServices from '../services/abbServices'
import * as avlServices from '../services/avlServices'
import * as rnServices from '../services/rnServices'

const serviceMap = {
    'fila': {
        'Adicionar': filaServices.adicionarFila,
        'Remover': filaServices.removerFila,
        'Buscar': filaServices.buscarFila,
    },
    'pilha': {
        'Adicionar': pilhaServices.inserirPilha,
        'Remover': pilhaServices.removerPilha,
        'Buscar': pilhaServices.buscarPilha,
    },
    'lista-encadeada': {
        'Adicionar no Início': listaServices.adicionarListaInicio,
        'Adicionar no Meio': listaServices.adicionarListaMeio,
        'Adicionar no Fim': listaServices.adicionarListaFim,
        'Adicionar Ordenado': listaServices.adicionarListaOrdenado,
        'Remover por Valor': listaServices.removerListaOrdenado,
        'Remover por Posição': listaServices.removerListaPosicao,
        'Buscar Elemento': listaServices.BuscarLista,
    },
    'arvore-binaria': {
        'Adicionar': abbServices.inserirAbb,
        'Remover': abbServices.removerAbb,
        'Buscar': abbServices.buscarAbb,
    },
    'arvore-avl': {
        'Adicionar': avlServices.inserirAvl,
        'Remover': avlServices.removerAvl,
        'Buscar': avlServices.buscarAvl,
    },
    'arvore-rubro-negra': {
        'Adicionar': rnServices.inserirRn,
        'Remover': rnServices.removerRn,
        'Buscar': rnServices.buscarRn,
    },
};

export default function Model(props){
    const [valor, setValor] = useState('')
    const [posicao, setPosicao] = useState('')
    const [loading, setLoading] = useState(false)
    const [alerta, setAlerta] = useState(null)
    const location = useLocation()
    const estrutura = location.pathname.split('/').pop()

    const handleClose = useCallback(() => {
        props.funcao(false)
        setAlerta(null)
        setValor('')
        setPosicao('')
    }, [props]);

    // Função para lidar com a tecla ESC
    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Escape' && props.estado) {
            handleClose()
        }
    }, [props.estado, handleClose])

    const needsInput = !(props.acao === 'Remover' && (estrutura === 'fila' || estrutura === 'pilha'));
    const needsPosicaoComValor = props.acao === 'Adicionar no Meio';
    const needsPosicaoSomente = props.acao === 'Remover por Posição';
    const isRemocaoPorValor = props.acao === 'Remover por Valor' || (props.acao === 'Remover' && (estrutura === 'arvore-binaria' || estrutura === 'arvore-avl' || estrutura === 'arvore-rubro-negra'));
    const isInsercao = props.acao === 'Adicionar' || props.acao === 'Adicionar no Início' || props.acao === 'Adicionar no Meio' || props.acao === 'Adicionar no Fim' || props.acao === 'Adicionar Ordenado';

    // Adicionar event listener para tecla ESC
    useEffect(() => {
        if (props.estado) {
            document.addEventListener('keydown', handleKeyDown)
            return () => {
                document.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [props.estado, handleKeyDown])

    // Função para verificar se um nó existe na estrutura
    const verificarExistencia = async (valorNumero) => {
        try {
            let buscarFunction = null;
            
            switch(estrutura) {
                case 'fila':
                    buscarFunction = filaServices.buscarFila;
                    break;
                case 'pilha':
                    buscarFunction = pilhaServices.buscarPilha;
                    break;
                case 'lista-encadeada':
                    buscarFunction = listaServices.BuscarLista;
                    break;
                case 'arvore-binaria':
                    buscarFunction = abbServices.buscarAbb;
                    break;
                case 'arvore-avl':
                    buscarFunction = avlServices.buscarAvl;
                    break;
                case 'arvore-rubro-negra':
                    buscarFunction = rnServices.buscarRn;
                    break;
                default:
                    return false;
            }
            
            const response = await buscarFunction(valorNumero);
            return response.data?.encontrado === true || response.data !== null;
        } catch (error) {
            // Se o erro for 404, não encontrado
            if (error.response?.status === 404) {
                return false;
            }
            console.error('Erro ao verificar existência:', error);
            return false;
        }
    };

    const enviarForm = useCallback(async (e) => {
        e.preventDefault();
        
        // Validações básicas
        if (needsInput && !needsPosicaoComValor && !needsPosicaoSomente && !valor) return;
        if (needsPosicaoComValor && !valor) return;
        if (needsPosicaoComValor && !posicao) return;
        if (needsPosicaoSomente && !posicao) return;

        setLoading(true);
        setAlerta(null);
        
        try {
            let response;
            const valorNumero = valor ? Number(valor) : null;
            
            // VALIDAÇÃO PARA INSERÇÃO - Verificar se o nó já existe
            if (isInsercao && valorNumero !== null) {
                const existe = await verificarExistencia(valorNumero);
                if (existe) {
                    setAlerta({ tipo: 'erro', mensagem: '⚠️ Nó já inserido!' });
                    setLoading(false);
                    setTimeout(() => setAlerta(null), 3000);
                    return;
                }
            }
            
            // VALIDAÇÃO PARA REMOÇÃO POR VALOR - Verificar se o nó existe
            if (isRemocaoPorValor && valorNumero !== null) {
                const existe = await verificarExistencia(valorNumero);
                if (!existe) {
                    setAlerta({ tipo: 'erro', mensagem: '❌ Nó não encontrado!' });
                    setLoading(false);
                    setTimeout(() => setAlerta(null), 3000);
                    return;
                }
            }
            
            // Processamento da ação
            if (props.acao === 'Adicionar no Meio') {
                response = await listaServices.adicionarListaMeio(Number(valor), Number(posicao));
            } else if (props.acao === 'Remover por Posição') {
                response = await listaServices.removerListaPosicao(Number(posicao));
            } else {
                const serviceFunction = serviceMap[estrutura]?.[props.acao];
                
                if (!serviceFunction) {
                    throw new Error(`Serviço não encontrado para ${estrutura} - ${props.acao}`);
                }

                if (props.acao === 'Remover' && (estrutura === 'fila' || estrutura === 'pilha')) {
                    response = await serviceFunction();
                } else {
                    response = await serviceFunction(Number(valor));
                }
            }
            
            // Sucesso
            if (isInsercao) {
                setAlerta({ tipo: 'sucesso', mensagem: '✅ Nó inserido com sucesso!' });
                setTimeout(() => setAlerta(null), 2000);
            } else if (isRemocaoPorValor || props.acao === 'Remover por Posição' || (props.acao === 'Remover' && (estrutura === 'fila' || estrutura === 'pilha'))) {
                setAlerta({ tipo: 'sucesso', mensagem: '✅ Nó removido com sucesso!' });
                setTimeout(() => setAlerta(null), 2000);
            }
            
            props.onSuccess?.(response?.data);
            handleClose();
        } catch (error) {
            console.error('Erro ao enviar:', error);
            
            // Tratamento específico para busca não encontrada
            if ((props.acao === 'Buscar Elemento' || props.acao === 'Buscar') && error.response?.status === 404) {
                props.onSuccess?.({
                    encontrado: false,
                    valor: Number(valor),
                    antecessor: null,
                    sucessor: null
                });
                handleClose();
            } else {
                // Verificar se o erro é de nó duplicado ou não encontrado
                const errorMessage = error.response?.data?.message || error.message;
                if (errorMessage.includes('duplicate') || errorMessage.includes('already exists') || errorMessage.includes('já existe')) {
                    setAlerta({ tipo: 'erro', mensagem: '⚠️ Nó já inserido!' });
                } else if (errorMessage.includes('not found') || errorMessage.includes('não encontrado')) {
                    setAlerta({ tipo: 'erro', mensagem: '❌ Nó não encontrado!' });
                } else {
                    setAlerta({ tipo: 'erro', mensagem: `Erro: ${errorMessage}` });
                }
                setTimeout(() => setAlerta(null), 3000);
                props.onError?.(error);
            }
        } finally {
            setLoading(false);
        }
    }, [valor, posicao, props, estrutura, needsInput, needsPosicaoComValor, needsPosicaoSomente, isInsercao, isRemocaoPorValor, handleClose]);

    const ref = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        if (props.estado) {
            setAlerta(null);
            if ((needsInput && !needsPosicaoComValor && !needsPosicaoSomente) && ref.current) {
                ref.current.focus();
            } else if ((needsPosicaoComValor) && ref.current) {
                ref.current.focus();
            } else if (needsPosicaoSomente && ref.current) {
                ref.current.focus();
            } else if (buttonRef.current && !needsInput) {
                buttonRef.current.focus();
            }
        }
    }, [props.estado, needsInput, needsPosicaoComValor, needsPosicaoSomente])

    return(
        <>
        {props.estado && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={handleClose}
                ></div>
            )}
        <div className={`${props.estado ? "flex" : "hidden"} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col z-50 bg-azul border-4 rounded-2xl border-amarelo items-center justify-center w-[85%] max-w-sm p-6 shadow-2xl`}>
            
            {/* Alerta flutuante */}
            {alerta && (
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white font-bold text-sm whitespace-nowrap z-50 ${
                    alerta.tipo === 'erro' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                    {alerta.mensagem}
                </div>
            )}
            
            <form onSubmit={enviarForm} className='flex flex-col gap-4 items-center w-full justify-center'>
                <div className='text-2xl md:text-3xl font-bold text-amarelo drop-shadow-md drop-shadow-black text-center'>
                    <h1>{props.acao}</h1>
                </div>
                <p className='text-[10px] text-ciano text-center'>para cancelar a ação pressione ESC ou clique em qualquer lugar</p>
                {needsInput && !needsPosicaoComValor && !needsPosicaoSomente && (
                    <div className="w-full">
                        {props.estado && (
                        <input 
                            value={valor} 
                            onChange={(e) => setValor(e.target.value)}
                            ref={ref}
                            type="number" 
                            name="numero" 
                            id="1" 
                            placeholder='digite um número' 
                            className='border-2 rounded-xl border-ciano h-10 w-full px-4 text-center text-azul bg-branco focus:outline-none focus:border-amarelo'
                            required
                        />)}
                    </div>
                )}
                {needsPosicaoComValor && (
                    <div className="w-full flex flex-col gap-3">
                        {props.estado && (
                            <>
                                <input 
                                    value={valor} 
                                    onChange={(e) => setValor(e.target.value)}
                                    ref={ref}
                                    type="number" 
                                    placeholder='valor' 
                                    className='border-2 rounded-xl border-ciano h-10 w-full px-4 text-center text-azul bg-branco focus:outline-none focus:border-amarelo'
                                    required
                                />
                                <input 
                                    value={posicao} 
                                    onChange={(e) => setPosicao(e.target.value)}
                                    type="number" 
                                    placeholder='posição' 
                                    className='border-2 rounded-xl border-ciano h-10 w-full px-4 text-center text-azul bg-branco focus:outline-none focus:border-amarelo'
                                    required
                                />
                            </>
                        )}
                    </div>
                )}
                {needsPosicaoSomente && (
                    <div className="w-full">
                        {props.estado && (
                        <input 
                            value={posicao} 
                            onChange={(e) => setPosicao(e.target.value)}
                            ref={ref}
                            type="number" 
                            placeholder='posição' 
                            className='border-2 rounded-xl border-ciano h-10 w-full px-4 text-center text-azul bg-branco focus:outline-none focus:border-amarelo'
                            required
                        />)}
                    </div>
                )}
                <button ref={buttonRef} type='submit' disabled={loading} className='border-4 rounded-2xl w-full py-2 text-xl text-amarelo border-amarelo bg-[rgba(0,0,0,0.2)] cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2 hover:bg-amarelo/20 transition-colors'>
                    {loading ? 'Verificando...' : props.acao}
                </button>
            </form>
        </div>
        </>
    )
}