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
    },
    'pilha': {
        'Adicionar': pilhaServices.inserirPilha,
        'Remover': pilhaServices.removerPilha,
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
        'Buscar': abbServices.buscarAbb, // Adicionado
    },
    'arvore-avl': {
        'Adicionar': avlServices.inserirAvl,
        'Remover': avlServices.removerAvl,
        'Buscar': avlServices.buscarAvl, // Adicionado
    },
    'arvore-rubro-negra': {
        'Adicionar': rnServices.inserirRn,
        'Remover': rnServices.removerRn,
        'Buscar': rnServices.buscarRn, // Adicionado
    },
};

export default function Model(props){
    const [valor, setValor] = useState('')
    const [posicao, setPosicao] = useState('')
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const estrutura = location.pathname.split('/').pop()

    const handleClose = useCallback(() => props.funcao(false), [props]);

    const needsInput = !(props.acao === 'Remover' && (estrutura === 'fila' || estrutura === 'pilha'));
    const needsPosicaoComValor = props.acao === 'Adicionar no Meio';
    const needsPosicaoSomente = props.acao === 'Remover por Posição';

    const enviarForm = useCallback(async (e) => {
        e.preventDefault();
        if (needsInput && !needsPosicaoComValor && !needsPosicaoSomente && !valor) return;
        if (needsPosicaoComValor && !valor) return;
        if (needsPosicaoComValor && !posicao) return;
        if (needsPosicaoSomente && !posicao) return;

        setLoading(true);
        try {
            let response;
            
            if (props.acao === 'Adicionar no Meio') {
                // Especial para "Adicionar no Meio" - passa valor E posição
                response = await listaServices.adicionarListaMeio(Number(valor), Number(posicao));
            } else if (props.acao === 'Remover por Posição') {
                // Remover por Posição - usa o valor como posição
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
            
            props.onSuccess?.(response.data);
            props.funcao(false);
            setValor('');
            setPosicao('');
        } catch (error) {
            console.error('Erro ao enviar:', error);
            
            if ((props.acao === 'Buscar Elemento' || props.acao === 'Buscar') && error.response?.status === 404) {
                props.onSuccess?.({
                    encontrado: false,
                    valor: Number(valor),
                    antecessor: null,
                    sucessor: null
                });
                props.funcao(false);
                setValor('');
                setPosicao('');
            } else {
                props.onError?.(error);
            }
        } finally {
            setLoading(false);
        }
    }, [valor, posicao, props, estrutura, needsInput, needsPosicaoComValor, needsPosicaoSomente]);

    const ref = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        if (props.estado) {
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
            <form onSubmit={enviarForm} className='flex flex-col gap-4 items-center w-full justify-center'>
                <div className='text-2xl md:text-3xl font-bold text-amarelo drop-shadow-md drop-shadow-black text-center'>
                    <h1>{props.acao}</h1>
                </div>
                <p className='text-[10px] text-ciano text-center'>para cancelar a ação pressione esc ou clique em qualquer lugar</p>
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
                    {loading ? 'Enviando...' : props.acao}
                </button>
            </form>
        </div>
        </>
    )
}