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
        'Adicionar': listaServices.adicionarListaOrdenado,
        'Remover': listaServices.removerListaOrdenado,
    },
    'arvore-binaria': {
        'Adicionar': abbServices.inserirAbb,
        'Remover': abbServices.removerAbb,
    },
    'arvore-avl': {
        'Adicionar': avlServices.inserirAvl,
        'Remover': avlServices.removerAvl,
    },
    'arvore-rubro-negra': {
        'Adicionar': rnServices.inserirRn,
        'Remover': rnServices.removerRn,
    },
};

export default function Model(props){
    const [valor, setValor] = useState('')
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const estrutura = location.pathname.split('/').pop()

    const handleClose = useCallback(() => props.funcao(false), [props]);

    const needsInput = !(props.acao === 'Remover' && (estrutura === 'fila' || estrutura === 'pilha'));

    const enviarForm = useCallback(async (e) => {
        e.preventDefault();
        if (needsInput && !valor) return;

        setLoading(true);
        try {
            const serviceFunction = serviceMap[estrutura]?.[props.acao];
            
            if (!serviceFunction) {
                throw new Error(`Serviço não encontrado para ${estrutura} - ${props.acao}`);
            }

            let response;
            if (props.acao === 'Remover' && (estrutura === 'fila' || estrutura === 'pilha')) {
                response = await serviceFunction();
            } else {
                response = await serviceFunction(Number(valor));
            }
            
            props.onSuccess?.(response.data);
            props.funcao(false);
            setValor('');
        } catch (error) {
            console.error('Erro ao enviar:', error);
            props.onError?.(error);
        } finally {
            setLoading(false);
        }
    }, [valor, props, estrutura, needsInput]);

    const ref = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        if (props.estado) {
            if (needsInput && ref.current) {
                ref.current.focus();
            } else if (!needsInput && buttonRef.current) {
                buttonRef.current.focus();
            }
        }
    }, [props.estado, needsInput])

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
                {needsInput && (
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
                <button ref={buttonRef} type='submit' disabled={loading} className='border-4 rounded-2xl w-full py-2 text-xl text-amarelo border-amarelo bg-[rgba(0,0,0,0.2)] cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2 hover:bg-amarelo/20 transition-colors'>
                    {loading ? 'Enviando...' : props.acao}
                </button>
            </form>
        </div>
        </>
    )
}