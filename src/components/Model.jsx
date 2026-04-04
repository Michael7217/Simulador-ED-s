import React from 'react'
import Titulo from './Titulo'
export default function Model(props){
    return(
        <>
        {props.estado && (
                <div 
                    className="fixed inset-0 bg-preto z-40 transition-opacity" onClick={() => props.funcao()} 
                ></div>
            )}
        <div className={`${props.estado ? "right-[25%]" : "hidden"} fixed flex flex-col z-50 bg-azul border-4 rounded-2xl border-amarelo items-center justify-center w-1/2 mx-auto my-[5%] gap-4 p-4`}>
            <div className='text-2xl md:text-3xl font-bold text-amarelo drop-shadow-md [-webkit-text-stroke:1px_black]'>
                <h1>{props.acao}</h1>
            </div>
            <p className='text-[10px] text-ciano'>para cancelar a ação pressione esc ou clique em qualquer lugar</p>
            <div>
                <input type="number" name="numero" id="1" 
                className='border-2 rounded-xl border-ciano h-10 w-70'/>
            </div>
            <button onClick={()=>{props.funcao(!props.estado)}} className='border-4 rounded-2xl px-7 py-1 text-xl text-amarelo border-amarelo bg-[rgba(0,0,0,0.2)] cursor-pointer font-medium'>{props.acao}</button>
        </div>
        </>
    )
}