import React from 'react'
import Quadro from '../components/Quadro'
import Titulo from '../components/Titulo'

export default function Home(){
    
    return(
        <>
        <Titulo/>
        <main className='flex flex-col h-125 flex-wrap items-center gap-7 w-full mx-auto '>
            <Quadro></Quadro>
            <Quadro></Quadro>
            <Quadro></Quadro>
            <Quadro></Quadro>
            <Quadro></Quadro>
            <Quadro></Quadro>
            
            
        </main>
        </>
    )
}