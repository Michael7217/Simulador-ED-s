import React from 'react';
import Titulo from '../components/Titulo';

export default function ListaEncadeada(){
    return(
        <>
        <Titulo nome='Lista encadeada'/>
        <div className='flex pl-60 gap-0 justify-around text-amarelo text-xl font-bold drop-shadow-xs'>
            <h2>Simulação</h2>
            <h2 className='pl-60 right-1'>Operações</h2>
        </div>
        <div className='flex justify-around border h-4/5 mx-6'>
            <div className='border h-screen w-2/3'>Quadro</div>
            <div className='border h-screen w-2/10'>quadro 2</div>
        </div>
        </>
    )
}