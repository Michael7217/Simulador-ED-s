import React from 'react'
import Logo from '../assets/Logo.png'
export default function Footer(){
    return(
        <footer className='relative bottom-0 w-full p-4 flex justify-center items-center bg-azul text-branco rounded-t-2xl mt-8 '>
            <div className='text-center md:text-left'>
                <h2 className='text-xl font-bold text-amarelo mb-2'>Desenvolvido por:</h2>
                <p>Michael Charlys Moreira da Silva</p>
                <p>Matheus de Assis</p>
                <p>Gabriel Gilvan</p>
            </div>
            <div className='flex flex-col items-center text-sm'>
                <img src={Logo} alt='logo' className='h-auto'></img>
                <p className='font-semibold text-ciano tracking-wide'>Simulador ED`s</p>
            </div>
        </footer>
    )
}