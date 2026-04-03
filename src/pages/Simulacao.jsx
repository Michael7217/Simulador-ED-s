import React from 'react';
import Titulo from '../components/Titulo';
import { useLocation } from 'react-router-dom';

export default function ListaEncadeada(){
    const pagina = useLocation();
    const nome = pagina.pathname.split('/').pop()
    return(
        <>
        <Titulo nome={nome}/>
        <div className='w-screen flex gap-0 justify-around text-amarelo text-xl md:text-xl font-bold drop-shadow-xs'>
            <h2 className='pl-[20%] md:pl-[20%]'>Simulação</h2>
            <h2 className='pl-[5%]  md:pl-[15%]'>Operações</h2>
        </div>
        <div className='flex justify-around border h-4/5 mx-6'>
            <div className='border h-screen w-2/3'>Quadro</div>
            <div className='border h-screen w-2/10'>quadro 2</div>
        </div>
        </>
    )
}