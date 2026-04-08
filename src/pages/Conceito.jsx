import React from "react";
import { useParams } from 'react-router-dom';
import Titulo from '../components/Titulo';

const estruturas = [
    {
        slug: 'lista-encadeada',
        titulo: "Lista Encadeada",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>lista encadeada</strong> é uma estrutura de dados linear formada por nós ligados entre si por ponteiros (referências).
                </p>
                <p className="mb-2">Cada nó da lista possui duas partes principais:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Dado:</strong> o valor armazenado.</li>
                    <li><strong>Ponteiro:</strong> a referência que aponta para o próximo nó da sequência.</li>
                </ul>
                <p>
                    Diferente de um vetor (array), os elementos da lista encadeada não ficam em posições consecutivas na memória. Isso permite que a lista cresça e diminua dinamicamente durante a execução do programa, sem desperdício de espaço.
                </p>
            </>
        )
    },
    {
        slug: 'fila',
        titulo: "Fila",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>fila</strong> é uma estrutura de dados linear que segue o princípio <strong>FIFO</strong> (<em>First In, First Out</em> — O primeiro a entrar é o primeiro a sair).
                </p>
                <p className="mb-2">Assim como em uma fila de pessoas em um banco, as operações possuem regras estritas:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Enfileirar (Enqueue):</strong> Novos elementos são adicionados sempre no <strong>fundo</strong> (final) da fila.</li>
                    <li><strong>Desenfileirar (Dequeue):</strong> A remoção ocorre sempre na <strong>frente</strong> (início) da fila.</li>
                </ul>
                <p>
                    Filas são amplamente utilizadas em sistemas operacionais, como no escalonamento de processos, gerenciamento de requisições web e filas de impressão.
                </p>
            </>
        )
    },
    {
        slug: 'pilha',
        titulo: "Pilha",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>pilha</strong> é uma estrutura de dados linear baseada no princípio <strong>LIFO</strong> (<em>Last In, First Out</em> — O último a entrar é o primeiro a sair).
                </p>
                <p className="mb-2">Imagine uma pilha real de pratos: você só pode interagir com o prato que está em cima. Suas operações principais são:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Empilhar (Push):</strong> Insere um novo elemento no <strong>topo</strong> da pilha.</li>
                    <li><strong>Desempilhar (Pop):</strong> Remove o elemento que está no <strong>topo</strong> da pilha.</li>
                </ul>
                <p>
                    As pilhas são essenciais na computação, sendo usadas para implementar o mecanismo de "Desfazer" nos editores de texto, a navegação de voltar nos navegadores de internet e o controle de chamadas de funções (Call Stack) na memória.
                </p>
            </>
        )
    },
    {
        slug: 'arvore-binaria',
        titulo: "Árvore Binária",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>árvore binária</strong> é uma estrutura de dados hierárquica (não linear) onde cada elemento, chamado de <strong>nó</strong>, pode ter no máximo <strong>dois filhos</strong> (um à esquerda e um à direita).
                </p>
                <p className="mb-2">Os componentes principais de uma árvore são:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Raiz:</strong> O nó superior e inicial da árvore.</li>
                    <li><strong>Folhas:</strong> Nós que estão na ponta e não possuem nenhum filho.</li>
                    <li><strong>Arestas:</strong> As conexões que ligam os nós.</li>
                </ul>
                <p>
                    As árvores são excelentes para representar hierarquias, como o sistema de pastas do seu computador, ou para servir de base estrutural para algoritmos mais complexos.
                </p>
            </>
        )
    },
    {
        slug: 'arvore-rubro-negra',
        titulo: "árvore rubro negra",
        conteudo: (
            <>
            <h1>O que é Árvore rubro negra?</h1>
            <p>Uma Árvore Rubro-Negra é uma árvore binária de busca auto-balanceada que organiza dados de forma eficiente, garantindo operações rápidas de busca, inserção e remoção com complexidade aproximada de O(log n). Ela utiliza nós coloridos em vermelho e preto e segue regras específicas — como manter a raiz preta, evitar dois nós vermelhos consecutivos e garantir o mesmo número de nós pretos em todos os caminhos da raiz até as folhas — para preservar o balanceamento automaticamente. Por isso, é muito utilizada em sistemas reais e bibliotecas de programação que exigem desempenho e organização eficiente dos dados.</p>
            </>
        )
    },
    {
        slug: 'arvore-avl',
        titulo: "Árvore AVL",
        conteudo: (
            <>
                <p className="mb-2">
                    A <strong>Árvore AVL</strong> é uma árvore binária de busca <strong>autobalanceada</strong> (seu nome vem dos criadores: Adelson-Velsky e Landis).
                </p>
                <p className="mb-2">
                    O grande problema das árvores de busca comuns é que, dependendo de como os dados são inseridos, elas podem crescer apenas para um lado e virar uma linha reta, perdendo sua eficiência. A AVL resolve isso impondo uma regra matemática:
                </p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li>O <strong>Fator de Balanceamento</strong> (a diferença de altura entre o lado esquerdo e direito de qualquer nó) não pode ser maior que 1 ou menor que -1.</li>
                </ul>
                <p>
                    Sempre que essa regra é quebrada após inserir ou remover um dado, a estrutura realiza <strong>rotações automáticas</strong> para se reequilibrar, garantindo que o tempo de busca seja sempre o mais rápido possível.
                </p>
            </>
        )
    }
];

export default function Conceito() {
    const { estrutura } = useParams();
    const estruturaAtual = estruturas.find(item => item.slug === estrutura) || estruturas[0];

    return (
        <div className="w-full min-h-screen p-4 md:p-8 font-sans text-azul max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Titulo nome={(estruturaAtual.titulo).toLowerCase()}></Titulo>
            </div>
            <div className="font-medium text-base md:text-lg leading-relaxed text-justify bg-white/20 p-6 rounded-2xl border-2 border-azul/10 shadow-sm">
                {estruturaAtual.conteudo}
            </div>
        </div>
    );
}