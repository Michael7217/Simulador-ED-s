import React from "react";
import Seta from '../assets/Seta.png'

const estruturas = [
    'Lista encadeada',
    'Fila',
    'Árvore Binária',
    'Pilha',
    'Árvore AVL',
    'Árvore'
]

export default function Quadro({index}){
    const estrutura = estruturas[index] || 'Estrutura'
    
    return(
        <div className="flex justify-between w-full h-auto md:h-32 border-4 border-branco rounded-2xl cursor-pointer p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="h-full flex flex-col gap-2 justify-center flex-1">
                <h1 className="text-lg md:text-2xl font-semibold">{estrutura}</h1>
                <p className="text-sm md:text-base">Conceito</p>
                <p className="text-sm md:text-base">Simulação</p>
            </div>
            <div className="flex flex-col justify-center ml-4">
                <img src={Seta} alt="entrar" className="w-4 h-4 md:w-5 md:h-5"/>
            </div>
        </div>
    )
}