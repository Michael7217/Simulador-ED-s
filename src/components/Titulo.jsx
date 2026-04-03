import React from 'react';
import OptionIcon from '../assets/OptionIcon.png'
export default function Titulo(){
    return(
            <div className='flex gap-3 py-3 px-4 md:gap-4 md:px-6 md:py-4'>
                <img src={OptionIcon} className='w-6 h-6 md:w-8 md:h-8'></img>
                <h1 className='text-xl md:text-3xl text-amarelo font-bold drop-shadow-3xl drop-shadow-laranja [-webkit-text-stroke:1px_black]'>Tipos de estruturas</h1>
            </div>
    )
}