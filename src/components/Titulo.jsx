import React from 'react';

import OptionIcon from '../assets/OptionIcon.png'

export default function Titulo(props){
    
    const titulo = (props.nome).replace(/-/g, ' ');
    return(
            <div className='flex gap-3 py-3 px-4 md:gap-4 md:px-6 md:py-4'>
                <img src={OptionIcon} className='w-6 h-6 md:w-8 md:h-8'></img>
                <h1 className='text-3xl font-bold text-amarelo drop-shadow-md drop-shadow-black'>{titulo}</h1>
            </div>
    )
}