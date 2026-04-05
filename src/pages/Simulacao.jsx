import React from 'react';
import Titulo from '../components/Titulo';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';

export default function Simulacao(){
    const pagina = useLocation();
    const nome = pagina.pathname.split('/').pop()
    const acoes = [
        'Adicionar',
        'Remover',
        'Avançar',
        'Voltar'
    ]
    return(
        <>
        <Titulo nome={nome}/>
        <div className='w-screen flex gap-0 justify-around text-amarelo text-xl md:text-xl font-bold drop-shadow-xs'>
            <h2 className='pl-[20%] md:pl-[20%]'>Simulação</h2>
            <h2 className='pl-[7%]  md:pl-[15%]'>Operações</h2>
        </div>
        <div className='flex justify-around h-4/5 mx-6'>
            <div className='border-4 border-azul rounded-2xl h-screen w-2/3'>
                quadro
            </div>
            <div className='border-4 border-azul rounded-2xl  w-2/10 h-60 flex flex-col '>
                <Button acao={acoes[0]}>
                    <p>{acoes[0]}</p>
                </Button>
                <Button acao={acoes[1]}>
                    <p>{acoes[1]}</p>
                </Button>
                <button acao={acoes[2]} className='border-2 rounded-2xl flex justify-center items-center text-2xs font-medium text-amarelo p-2 m-1 mt-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'>
                    <p>{acoes[2]}</p>
                </button>
                <button acao={acoes[3]} className='border-2 rounded-2xl flex justify-center items-center text-2xs font-medium text-amarelo p-2 m-1 mt-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'>
                    <p>{acoes[3]}</p>
                </button>
            </div>
        </div>
        </>
    )
}