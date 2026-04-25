import React, { useEffect, useRef } from 'react'

export default function ApresentacaoBuscar(props){
    const handleClose = () => props.funcao?.(false);
    const botaoFecharRef = useRef(null);
    
    const resultado = props.resultado;
    const encontrado = resultado && resultado?.encontrado !== false && resultado?.valor !== undefined;
    
    
    useEffect(() => {
        if (props.estado && botaoFecharRef.current) {
            
            setTimeout(() => {
                botaoFecharRef.current?.focus();
            }, 100);
        }
    }, [props.estado]);
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (props.estado && event.key === 'Enter') {
                event.preventDefault();
                handleClose();
            }
        };
        
        if (props.estado) {
            document.addEventListener('keydown', handleKeyDown);
        }
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [props.estado]);
    
    return(
        <>
        {props.estado && (
            <div 
                className="fixed inset-0 bg-black/20 z-40 transition-opacity" 
                onClick={handleClose}
            ></div>
        )}
        <div className={`${props.estado ? "flex" : "hidden"} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col z-50 bg-azul border-4 rounded-2xl border-amarelo items-center justify-center w-[85%] max-w-md p-6 shadow-2xl`}>
            <h1 className='text-2xl md:text-3xl font-bold text-amarelo drop-shadow-md drop-shadow-black text-center mb-4'>
                Resultados da Busca
            </h1>
            
            <div className='border-4 border-amarelo rounded-2xl w-full p-4 bg-azul'>
                {encontrado ? (
                    <div className='flex flex-col gap-3 text-branco'>
                        <h2 className='text-2xl font-bold text-amarelo text-center mb-2'>✓ Elemento Encontrado!</h2>
                        <div className='flex flex-col gap-2 text-lg font-medium'> 
                            <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                <span className='text-ciano'>Valor:</span>
                                <span className='font-bold text-amarelo'>{resultado?.valor}</span>
                            </div>

                            {resultado?.antecessor !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                    <span className='text-ciano'>Antecessor:</span>
                                    <span className='font-bold text-amarelo'>{resultado?.antecessor !== null ? resultado.antecessor : 'NULL'}</span>
                                </div>
                            )}
                            {resultado?.sucessor !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                    <span className='text-ciano'>Sucessor:</span>
                                    <span className='font-bold text-amarelo'>{resultado?.sucessor !== null ? resultado.sucessor : 'NULL'}</span>
                                </div>
                            )}

                            {resultado?.pai !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                    <span className='text-ciano'>Pai:</span>
                                    <span className='font-bold text-amarelo'>{resultado?.pai !== null ? resultado.pai : 'NULL'}</span>
                                </div>
                            )}
                            {resultado?.esq !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                    <span className='text-ciano'>Esquerda:</span>
                                    <span className='font-bold text-amarelo'>{resultado?.esq !== null ? resultado.esq : 'NULL'}</span>
                                </div>
                            )}
                            {resultado?.dir !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                    <span className='text-ciano'>Direita:</span>
                                    <span className='font-bold text-amarelo'>{resultado?.dir !== null ? resultado.dir : 'NULL'}</span>
                                </div>
                            )}
                            {resultado?.cor !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2 items-center'>
                                    <span className='text-ciano'>Cor:</span>
                                    <span className={`font-bold px-2 py-0.5 rounded text-sm ${resultado.cor === 'Rubro' ? 'text-white bg-red-600' : 'text-white bg-slate-800'}`}>
                                        {resultado.cor}
                                    </span>
                                </div>
                            )}
                            {resultado?.bal !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                    <span className='text-ciano'>Balanceamento (AVL):</span>
                                    <span className='font-bold text-amarelo'>{resultado.bal}</span>
                                </div>
                            )}
                            {resultado?.altura !== undefined && (
                                <div className='flex justify-between border-b border-ciano/30 pb-2'>
                                    <span className='text-ciano'>Altura:</span>
                                    <span className='font-bold text-amarelo'>{resultado.altura}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col gap-3 text-branco items-center'>
                        <h2 className='text-2xl font-bold text-red-400 text-center mb-2'>✗ Elemento Não Encontrado!</h2>
                        {resultado?.valor && (
                            <div className='text-lg font-medium text-center'>
                                <p>Valor procurado: <span className='text-amarelo font-bold'>{resultado.valor}</span></p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <button 
                ref={botaoFecharRef}
                onClick={handleClose}
                className='border-4 rounded-2xl w-full py-2 text-xl text-amarelo border-amarelo bg-[rgba(0,0,0,0.2)] cursor-pointer font-medium mt-4 hover:bg-amarelo/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amarelo focus:ring-offset-2 focus:ring-offset-azul'
                tabIndex={0}
            >
                Fechar
            </button>
        </div>
        </>
    )
}