import React from 'react'
import Logo from '../assets/Logo.png'
export default function Footer(){
    return(
        <footer className='relative bottom-0 w-full p-4 flex justify-center items-center bg-azul rounded-t-2xl mt-7'>
            <div className='text-sm'>
                <h2 className='text-lg'>Desenvolvido por:</h2>
                <p>Michael Charlys Moreira da Silva</p>
                <p>Matheus de Assis</p>
                <p>Gabriel Gilvan</p>
            </div>
            <div className='text-sm gap-0'>
                <img src={Logo} alt='logo' className='h-auto'></img>
                <p className='border-2'>Simulador ED`s</p>
            </div>
        </footer>
    )
}