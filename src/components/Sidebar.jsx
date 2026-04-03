import React from "react";
import Logo from '../assets/Logo.png';
import EstIcon from '../assets/EstIcon.png';
import HomeIcon from '../assets/HomeIcon.png';
import SairIcon from '../assets/SairIcon.png';
import { Link } from 'react-router-dom';

export default function Sidebar(props) {
    return (
        <aside className={`${props.estado ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 bg-azul w-72 flex-col items-center border-2 border-amarelo rounded-xl px-8 pt-8 transition-transform duration-300`}>

            <a onClick={() => { props.funcao() }} className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer text-amarelo hover:brightness-110 transition-all text-lg font-medium">
                <img src={SairIcon} alt="Ícone voltar" />
                Voltar
            </a>

            <div className="flex flex-col items-center justify-center w-full text-nowrap mt-10">
                <img src={Logo} alt='logo'/>
                <h1 className="mt-2 text-sm text-branco">ED`s simulador de estruturas de dados</h1>
            </div>

            <div className="flex flex-col  gap-6 mt-10 w-full">

                <div className="gap-4 text-xl cursor-pointer pb-2 border-b-2 border-b-ciano"> 
                    
                    <Link to='/' className="flex gap-4" onClick={()=>{props.funcao(!props.estado)}}>
                        <img src={HomeIcon} className="w-7 h-6 pl-1"/>
                        <h2>Home</h2>
                    </Link>
                </div>

                <div className="flex items-center gap-4 text-xl cursor-pointer pb-2 border-b-2 border-b-ciano">
                    <Link to='/simulacao/lista-encadeada' className="flex gap-3" onClick={()=>{props.funcao(!props.estado)}}>
                        <img src={EstIcon} className="w-8 h-8"/>
                        <h2>Lista Encadeada</h2>
                    </Link>
                </div>

                <div className="gap-4 text-xl cursor-pointer pb-2 border-b-2 border-b-ciano">
                    <Link to='/simulacao/fila' className="flex gap-3" onClick={()=>{props.funcao(!props.estado)}}>
                        <img src={EstIcon} className="w-8 h-8"/>
                        <h2>Fila</h2>
                    </Link>
                </div>

                <div className="gap-4 text-xl cursor-pointer pb-2 border-b-2 border-b-ciano">
                    <Link to='/simulacao/pilha' className="flex gap-3" onClick={()=>{props.funcao(!props.estado)}}>
                        <img src={EstIcon} className="w-8 h-8"/>
                        <h2>Pilha</h2>  
                    </Link>
                </div>

                <div className="gap-4 text-xl cursor-pointerpb-2 border-b-2 border-b-ciano">
                    <Link to='/simulacao/arvore-binaria' className="flex gap-3" onClick={()=>{props.funcao(!props.estado)}}>
                        <img src={EstIcon} className="w-8 h-8 mb-2"/>
                        <h2>Árvore Binária</h2> 
                    </Link>   
                </div>

                <div className="gap-4 text-xl cursor-pointer pb-2 border-b-2 border-b-ciano">
                    <Link to='/sobre' className="flex gap-3" onClick={()=>{props.funcao(!props.estado)}}>
                        <img src={EstIcon} className="w-8 h-8"/>
                        <h2>Sobre</h2>  
                    </Link>
                </div>

            </div>

        </aside>
    );
}