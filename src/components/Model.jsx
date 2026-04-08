import React, { useState, useCallback } from 'react'
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
    'arvore': {
        'Adicionar': abbServices.inserirAbb,
        'Remover': abbServices.removerAbb,
    },
    'arvore-binaria': {
        'Adicionar': abbServices.inserirAbb,
        'Remover': abbServices.removerAbb,
    },
    'arvore-avl': {
        'Adicionar': avlServices.inserirAvl,
        'Remover': avlServices.removerAvl,
    },
    'arvore-rn': {
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

    return(
        <>
        {props.estado && (
                <div 
                    className="fixed inset-0 bg-white/50 z-40 transition-opacity" onClick={handleClose}
                ></div>
            )}
        <div className={`${props.estado ? "right-[30%]" : "hidden"} fixed flex flex-col z-50 bg-azul border-4 rounded-2xl border-amarelo items-center justify-center w-1/2 mx-auto my-[5%] gap-6 p-4 md:w-1/3 md:h-1/3`}>
            <form onSubmit={enviarForm} className='flex flex-col gap-4 items-center w-1/2 justify-center '>
                <div className='text-2xl md:text-3xl font-bold text-amarelo drop-shadow-md [-webkit-text-stroke:1px_black]'>
                    <h1>{props.acao}</h1>
                </div>
                <p className='text-[10px] text-ciano'>para cancelar a ação pressione esc ou clique em qualquer lugar</p>
                {needsInput && (
                    <div>
                        <input 
                            value={valor} 
                            onChange={(e) => setValor(e.target.value)} 
                            type="number" 
                            name="numero" 
                            id="1" 
                            placeholder='digite um número' 
                            className='border-2 rounded-xl border-ciano h-10 w-70'
                            required
                        />
                    </div>
                )}
                <button type='submit' disabled={loading} className='border-4 rounded-2xl px-7 py-1 text-xl text-amarelo border-amarelo bg-[rgba(0,0,0,0.2)] cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
                    {loading ? 'Enviando...' : props.acao}
                </button>
            </form>
        </div>
        </>
    )
}