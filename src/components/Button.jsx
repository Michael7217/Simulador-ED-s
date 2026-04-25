import React, {useState, useCallback} from 'react'
import Model from './Model'

export default function Button(props){
    const [estado, setEstado] = useState(false)

    const handleSuccess = useCallback((data) => {
        console.log('Sucesso:', data);
        props.onSuccess?.(data);
    }, [props]);

    const handleError = useCallback((error) => {
        console.error('Erro:', error);
        alert('Erro ao executar operação');
    }, []);

    const toggleModal = useCallback(() => setEstado(!estado), [estado]);

    return(
        <>
            <button
                type='button'
                onClick={toggleModal}
                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
            >
                {props.children}
            </button>
            <Model 
                acao={props.acao} 
                estado={estado} 
                funcao={setEstado}
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </>
    )
}