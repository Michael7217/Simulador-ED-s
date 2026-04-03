import React from 'react'
import Quadro from '../components/Quadro'
import Titulo from '../components/Titulo'

export default function Home(){
    
    return(
        <>
        <Titulo/>
        <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-4 md:p-6 lg:p-8 w-full mx-auto max-w-6xl'>
            <Quadro index={0}></Quadro>
            <Quadro index={1}></Quadro>
            <Quadro index={2}></Quadro>
            <Quadro index={3}></Quadro>
            <Quadro index={4}></Quadro>
            <Quadro index={5}></Quadro>
        </main>
        </>
    )
}