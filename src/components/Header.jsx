import React from "react";
import menuicon from '../assets/MenuIcon.png'
import Logo from '../assets/Logo.png'



export default function Header(props){
    
    return(
        <header className="relative z-10 w-full h-18 bg-azul flex items-center px-4 rounded-b-xl">
            <div className="h-5 w-8" onClick={()=>{props.funcao()}} >
                <img src={menuicon} alt="menu" className="cursor-pointer"/>
            </div>
            <div className="h-auto w-full flex items-center justify-center gap-2 text-2xl">
                <img src={Logo} alt="logo" />
                <h1 className="font-bold">Simulador ED`s</h1>
            </div>

        </header>
    )
}