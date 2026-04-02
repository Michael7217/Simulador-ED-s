import React from "react";
import menuicon from '../assets/MenuIcon.png'
import Logo from '../assets/Logo.png'

export default function Header(){
    return(
        <header className="w-full h-20 bg-azul flex items-center px-4">
            <div className="h-5 w-8" >
                <img src={menuicon} alt="menu" className="cursor-pointer"/>
            </div>
            <div className="h-auto w-full flex items-center  justify-center gap-2">
                <img src={Logo} alt="logo" />
                <h1>Simulador ED`s</h1>
            </div>

        </header>
    )
}