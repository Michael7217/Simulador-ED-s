import React from "react";
import OptionIcon from '../assets/OptionIcon.png';

const estruturas = [
    {
        titulo: "Lista Encadeada",
        conteudo: (
            <>
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porta aliquam porttitor. Sed et nisi eu magna malesuada pulvinar vitae sed odio. Donec tellus magna, malesuada vel interdum eget, euismod vitae nulla. Etiam tortor sapien, porta ac eleifend eget, imperdiet sed tortor. Suspendisse eu molestie urna. Sed eget hendrerit purus. Quisque aliquet augue ut vulputate malesuada. Aenean dolor mi, porttitor nec urna eget, efficitur tempus neque. Mauris convallis dui viverra, hendrerit lorem a, dapibus orci. Quisque non eleifend felis. Morbi vel fermentum lectus. Morbi ac lectus ligula.</p>
            </>
        )
    },
    {
        titulo: "Fila",
        conteudo: (
            <>
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porta aliquam porttitor. Sed et nisi eu magna malesuada pulvinar vitae sed odio. Donec tellus magna, malesuada vel interdum eget, euismod vitae nulla. Etiam tortor sapien, porta ac eleifend eget, imperdiet sed tortor. Suspendisse eu molestie urna. Sed eget hendrerit purus. Quisque aliquet augue ut vulputate malesuada. Aenean dolor mi, porttitor nec urna eget, efficitur tempus neque. Mauris convallis dui viverra, hendrerit lorem a, dapibus orci. Quisque non eleifend felis. Morbi vel fermentum lectus. Morbi ac lectus ligula.</p>
            </>
        )
    },
    {
        titulo: "Árvore Binária",
        conteudo: (
            <>
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porta aliquam porttitor. Sed et nisi eu magna malesuada pulvinar vitae sed odio. Donec tellus magna, malesuada vel interdum eget, euismod vitae nulla. Etiam tortor sapien, porta ac eleifend eget, imperdiet sed tortor. Suspendisse eu molestie urna. Sed eget hendrerit purus. Quisque aliquet augue ut vulputate malesuada. Aenean dolor mi, porttitor nec urna eget, efficitur tempus neque. Mauris convallis dui viverra, hendrerit lorem a, dapibus orci. Quisque non eleifend felis. Morbi vel fermentum lectus. Morbi ac lectus ligula.</p>
            </>
        )
    },
    {
        titulo: "Pilha",
        conteudo: (
            <>
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porta aliquam porttitor. Sed et nisi eu magna malesuada pulvinar vitae sed odio. Donec tellus magna, malesuada vel interdum eget, euismod vitae nulla. Etiam tortor sapien, porta ac eleifend eget, imperdiet sed tortor. Suspendisse eu molestie urna. Sed eget hendrerit purus. Quisque aliquet augue ut vulputate malesuada. Aenean dolor mi, porttitor nec urna eget, efficitur tempus neque. Mauris convallis dui viverra, hendrerit lorem a, dapibus orci. Quisque non eleifend felis. Morbi vel fermentum lectus. Morbi ac lectus ligula.</p>
            </>
        )
    },
    {
        titulo: "Árvore AVL",
        conteudo: (
            <>
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porta aliquam porttitor. Sed et nisi eu magna malesuada pulvinar vitae sed odio. Donec tellus magna, malesuada vel interdum eget, euismod vitae nulla. Etiam tortor sapien, porta ac eleifend eget, imperdiet sed tortor. Suspendisse eu molestie urna. Sed eget hendrerit purus. Quisque aliquet augue ut vulputate malesuada. Aenean dolor mi, porttitor nec urna eget, efficitur tempus neque. Mauris convallis dui viverra, hendrerit lorem a, dapibus orci. Quisque non eleifend felis. Morbi vel fermentum lectus. Morbi ac lectus ligula.</p>
            </>
        )
    },
    {
        titulo: "Árvore",
        conteudo: (
            <>
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porta aliquam porttitor. Sed et nisi eu magna malesuada pulvinar vitae sed odio. Donec tellus magna, malesuada vel interdum eget, euismod vitae nulla. Etiam tortor sapien, porta ac eleifend eget, imperdiet sed tortor. Suspendisse eu molestie urna. Sed eget hendrerit purus. Quisque aliquet augue ut vulputate malesuada. Aenean dolor mi, porttitor nec urna eget, efficitur tempus neque. Mauris convallis dui viverra, hendrerit lorem a, dapibus orci. Quisque non eleifend felis. Morbi vel fermentum lectus. Morbi ac lectus ligula.</p>
            </>
        )
    }
];

export default function PaginaEstrutura({index}){
    const estrutura = estruturas[index];

    return(
        <div className="w-full min-h-screen p-6 md:p-10 font-sans text-azul">
            <div className="flex items-center gap-2 mb-8">
                <div className='flex gap-3 py-3 px-2 md:gap-4 md:px-4 md:py-4'>
                    <img src={OptionIcon} className='w-6 h-6 md:w-8 md:h-8' alt="opção"></img>
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-amarelo drop-shadow-md [-webkit-text-stroke:1px_black]">
                    {estrutura.titulo}
                </h2>
            </div>

            <div className="font-medium text-base md:text-lg leading-relaxed flex flex-col gap-4">
                {estrutura.conteudo}
            </div>
        </div>
    );
}