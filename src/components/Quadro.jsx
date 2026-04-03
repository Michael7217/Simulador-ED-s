import React from "react";
import Seta from '../assets/Seta.png'
export default function Quadro(){
    return(
        <div className="flex justify-between w-100 h-37 border-4 border-branco rounded-2xl cursor-pointer mx-10 max-w-3xl">
            <div className="h-full flex flex-col gap-2">
                <h1 className="text-2xl mt-3 px-4">Lista encadeada</h1>
                <p className="ml-5">Conceito</p>
                <p className="ml-5">Simulação</p>
            </div>
            <div className="flex flex-col justify-center mr-5">
                <img src={Seta} alt="entrar" className="w-8 h-8 "/>
            </div>
        </div>
    )
}