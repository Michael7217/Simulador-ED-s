import React from "react";
import menuicon from '../assets/MenuIcon.png'
import Logo from '../assets/Logo.png'
import { useLocation, Link } from 'react-router-dom'


export default function Header(props){
    const pagina = useLocation();
    const pathParts = pagina.pathname.split('/').filter(Boolean);
    const page = pathParts[0] || '';
    const estrutura = pathParts[1] || '';
    const isHome = pagina.pathname === '/' || pagina.pathname === '/sobre';
    const isSimulacao = page === 'simulacao';
    const isConceito = page === 'conceito';
    const targetPath = isSimulacao ? `/conceito/${estrutura}` : isConceito ? `/simulacao/${estrutura}` : '/';
    const buttonText = isSimulacao ? 'Conceito' : 'Simulação';

    return(
        <header className="relative z-10 w-full h-18 bg-azul flex items-center px-4 rounded-b-xl justify-between">
            <div className="h-5 w-8" onClick={()=>{props.funcao()}}>
                <img src={menuicon} alt="menu" className="cursor-pointer"/>
            </div>
            <div className="h-auto w-full flex items-center justify-center gap-2 text-2xl">
                <img src={Logo} alt="logo" />
                <h1 className="font-bold text-branco">Simulador ED`s</h1>
            </div>
            <div className="w-24 md:w-32 flex justify-end">
                {!isHome && estrutura && (
                    <Link to={targetPath} className="text-amarelo font-bold text-sm md:text-lg hover:text-laranja! transition-all duration-300 cursor-pointer">
                        {buttonText}
                    </Link>
                )}
                </div>

        </header>
    )
}