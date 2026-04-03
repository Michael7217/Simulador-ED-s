import React from 'react';
import OptionIcon from '../assets/OptionIcon.png'
export default function Titulo(){
    return(
            <div className='flex gap-4 pl-5 py-4'>
                <img src={OptionIcon}></img>
                <h1 className='text-2xl text-amarelo font-bold'>Tipos de estruturas</h1>
            </div>
    )
}