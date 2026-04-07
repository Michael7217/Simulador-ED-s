import React, {useState, useCallback} from 'react'
import {Link} from 'react-router-dom'
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
            <Link onClick={toggleModal} className='border-2 rounded-2xl flex justify-center items-center text-2xs font-medium text-amarelo p-2 m-1 mt-2 bg-[rgba(0,0,0,0.2)]'>
                <button className='cursor-pointer'>
                    {props.children}
                </button>
            </Link>
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