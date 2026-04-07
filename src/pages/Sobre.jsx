import React from 'react'
import Titulo from '../components/Titulo'
import Logo from '../assets/Logo.png'

export default function Sobre() {
    return (
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 font-sans">
            <Titulo nome="Sobre o Projeto"/>

            <div className="max-w-4xl mx-auto bg-azul rounded-2xl shadow-2xl p-6 md:p-10 border-2 border-amarelo/30 text-branco mt-8">
                
                <div className="flex flex-col items-center mb-8 border-b border-ciano/30 pb-8">
                    <img src={Logo} alt="Logo Simulador ED" className="w-24 h-24 md:w-32 md:h-32 mb-4 drop-shadow-lg"/>
                    <h2 className="text-2xl md:text-4xl font-bold text-amarelo text-center tracking-wide">
                        Simulador ED's
                    </h2>
                    <p className="text-ciano mt-2 text-center text-sm md:text-base">
                        Simulador de Estruturas de Dados
                    </p>
                </div>

                <div className="space-y-6 text-base md:text-lg leading-relaxed text-justify">
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga magnam unde facilis asperiores quasi libero modi illo, eum est et explicabo optio, nam accusantium autem? Adipisci perferendis atque dicta iusto!
                    </p>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga magnam unde facilis asperiores quasi libero modi illo, eum est et explicabo optio, nam accusantium autem? Adipisci perferendis atque dicta iusto!
                    </p>
                    
                    <div className="mt-10 bg-ciano/10 p-6 rounded-xl border border-ciano/20">
                        <h3 className="text-xl md:text-2xl font-bold text-amarelo mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amarelo"></div>
                            Equipe de Desenvolvimento
                        </h3>
                        <p className="mb-4">
                            Este projeto foi idealizado e construído por estudantes da Universidade Federal do Ceará - Campus de Russas:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-2 text-lg font-medium text-branco">
                            <li>Michael Charlys Moreira da Silva</li>
                            <li>Matheus de Assis</li>
                            <li>Gabriel Gilvan</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}