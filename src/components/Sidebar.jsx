import React, { useCallback } from "react";
import Logo from '../assets/Logo.png';
import EstIcon from '../assets/EstIcon.png';
import HomeIcon from '../assets/HomeIcon.png';
import SairIcon from '../assets/SairIcon.png';
import { Link } from 'react-router-dom';

export default function Sidebar(props) {
    const handleClose = useCallback(() => props.funcao(), [props.funcao]);

    return (
        <>
            {props.estado && (
                <div 
                    className="fixed inset-0 bg-white/50 z-40 transition-opacity" onClick={handleClose}
                ></div>
            )}

            <aside className={`${props.estado ? "translate-x-0" : "-translate-x-full"} absolute inset-y-0 left-0 z-50 bg-azul w-72 h-screen overflow-y-auto flex flex-col items-center border-2 border-amarelo rounded-xl px-8 pt-8 transition-transform duration-300`}>

                <a onClick={handleClose} className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer text-amarelo hover:brightness-110 transition-all text-lg font-medium">
                    <img src={SairIcon} alt="Ícone voltar" />
                    Voltar
                </a>

                <div className="flex flex-col items-center justify-center w-full text-nowrap mt-10">
                    <img src={Logo} alt='logo'/>
                    <h1 className="mt-2 text-sm text-branco">ED`s simulador de estruturas de dados</h1>
                </div>

                <div className="flex flex-col w-full mt-8 mb-10">
                    
                    <div className="border-b-2 border-ciano py-3"> 
                        <Link to='/' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={HomeIcon} className="w-6 h-6 object-contain" alt="Home"/>
                            <h2>Home</h2>
                        </Link>
                    </div>

                    <div className="border-b-2 border-ciano py-3">
                        <Link to='/simulacao/lista-encadeada' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={EstIcon} className="w-7 h-7 object-contain" alt="Estrutura"/>
                            <h2>Lista Encadeada</h2>
                        </Link>
                    </div>

                    <div className="border-b-2 border-ciano py-3">
                        <Link to='/simulacao/fila' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={EstIcon} className="w-7 h-7 object-contain" alt="Estrutura"/>
                            <h2>Fila</h2>
                        </Link>
                    </div>

                    <div className="border-b-2 border-ciano py-3">
                        <Link to='/simulacao/pilha' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={EstIcon} className="w-7 h-7 object-contain" alt="Estrutura"/>
                            <h2>Pilha</h2>  
                        </Link>
                    </div>

                    <div className="border-b-2 border-ciano py-3">
                        <Link to='/simulacao/arvore-binaria' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={EstIcon} className="w-7 h-7 object-contain" alt="Estrutura"/>
                            <h2>Árvore Binária</h2> 
                        </Link>   
                    </div>

                    <div className="border-b-2 border-ciano py-3">
                        <Link to='/simulacao/arvore-avl' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={EstIcon} className="w-7 h-7 object-contain" alt="Estrutura"/>
                            <h2>Árvore AVL</h2> 
                        </Link>   
                    </div>

                    <div className="border-b-2 border-ciano py-3">
                        <Link to='/simulacao/arvore' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={EstIcon} className="w-7 h-7 object-contain" alt="Estrutura"/>
                            <h2>Árvore binária de busca</h2> 
                        </Link>   
                    </div>

                    <div className="border-b-2 border-ciano py-3 border-none">
                        <Link to='/sobre' className="flex items-center gap-3 text-lg text-amarelo hover:!text-branco transition-colors" onClick={handleClose}>
                            <img src={EstIcon} className="w-7 h-7 object-contain" alt="Sobre"/>
                            <h2>Sobre</h2>  
                        </Link>
                    </div>

                </div>

            </aside>
        </>
    );
}