import React from "react";
import { useParams } from 'react-router-dom';
import OptionIcon from '../assets/OptionIcon.png';

const estruturas = [
    {
        slug: 'lista-encadeada',
        titulo: "Lista Encadeada",
        conteudo: (
            <>
            <h1>O que é Lista Encadeada?</h1>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga magnam unde facilis asperiores quasi libero modi illo, eum est et explicabo optio, nam accusantium autem? Adipisci perferendis atque dicta iusto!</p>
            </>
        )
    },
    {
        slug: 'fila',
        titulo: "Fila",
        conteudo: (
            <>
            <h1>O que é Fila?</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint quibusdam nihil inventore consequuntur vitae ipsa distinctio eum atque autem qui ullam sapiente id, porro voluptas! Minima atque provident deleniti dolores?</p>
            </>
        )
    },
    {
        slug: 'arvore-binaria',
        titulo: "Árvore Binária",
        conteudo: (
            <>
            <h1>O que é Árvore Binária?</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet debitis quo quidem delectus nemo natus aperiam saepe earum consectetur! Facilis maxime consectetur exercitationem ex asperiores quo placeat quam, quisquam nesciunt.</p>
            </>
        )
    },
    {
        slug: 'pilha',
        titulo: "Pilha",
        conteudo: (
            <>
            <h1>O que é Pilha?</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi laudantium saepe enim non similique veniam recusandae pariatur perspiciatis fugiat cupiditate omnis maxime dignissimos doloribus tempora iste, iusto optio, porro velit!</p>
            </>
        )
    },
    {
        slug: 'arvore-avl',
        titulo: "Árvore AVL",
        conteudo: (
            <>
            <h1>O que é Árvore AVL?</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, magnam molestias nostrum pariatur maxime officiis hic dolore. Quas nemo, commodi sit voluptas, modi perspiciatis praesentium fugiat, vel facilis tenetur tempora.</p>
            </>
        )
    },
    {
        slug: 'arvore',
        titulo: "Árvore",
        conteudo: (
            <>
            <h1>O que é Árvore?</h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi accusantium aut optio obcaecati, corrupti unde voluptas ratione consequatur, repellat sequi dolorem minus magni numquam a iste recusandae. Ipsam, repudiandae architecto.</p>
            </>
        )
    }
];

export default function PaginaEstrutura(){
    const { estrutura } = useParams();
    const estruturaAtual = estruturas.find(item => item.slug === estrutura) || estruturas[0];

    return(
        <div className="w-full min-h-screen p-6 md:p-5 font-sans text-azul">
            <div className="flex items-center gap-2 mb-4">
                <div className='flex gap-3 py-3 px-2 md:gap-4 md:px-4 md:py-1'>
                    <img src={OptionIcon} className='w-6 h-6 md:w-8 md:h-8' alt="opção"></img>
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-amarelo drop-shadow-md [-webkit-text-stroke:1px_black]">
                    {estruturaAtual.titulo}
                </h2>
            </div>

            <div className="font-medium text-base md:text-lg leading-relaxed flex flex-col gap-4">
                {estruturaAtual.conteudo}
            </div>
        </div>
    );
}