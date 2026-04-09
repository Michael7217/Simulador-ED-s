import React from "react";
import { useParams } from 'react-router-dom';
import Titulo from '../components/Titulo';

const estruturas = [
    {
        slug: 'lista-encadeada',
        titulo: "O que é uma lista Encadeada?",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>lista encadeada</strong> é uma estrutura de dados dinâmica que consiste em uma sequência de elementos encadeados, onde cada elemento é definido como um nó.
                </p>
                <p className="mb-2">Cada nó da lista possui duas informações principais:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Dado:</strong> a informação armazenada propriamente dita.</li>
                    <li><strong>Ponteiro:</strong> uma referência (endereço de memória) que indica o próximo elemento da lista.</li>
                </ul>
                <p>
                    Uma das grandes vantagens das lista encadeadas é que os elementos não precisam ser armazenados sequencialmente na memória, ao contrário dos vetores. Cada elemento pode ser alocado de forma dinâmica em diferentes regiões da memória, permitindo flexibilidade de espaço e crescimento sob demanda.
                </p>
            </>
        )
    },
    {
        slug: 'fila',
        titulo: "O que é uma fila?",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>fila</strong> é um Tipo Abstrato de Dados linear que funciona seguindo a regra <strong>FIFO</strong> (<em>First In, First Out</em>), o que significa que o primeiro elemento a entrar (inserido) é o primeiro a sair (removido).
                </p>
                <p className="mb-2">Como em uma fila de padaria, as interações acontecem nas extremidades:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Inserção:</strong> Acontece sempre no final da fila.</li>
                    <li><strong>Remoção:</strong> Acontece sempre a partir da extremidade oposta, ou seja, pelo início da fila.</li>
                </ul>
                <p>
                    Um exemplo comum de uso de filas na computação é o controle de impressão em um sistema operacional, onde os trabalhos são adicionados à fila e processados rigorosamente na ordem em que chegam.
                </p>
            </>
        )
    },
    {
        slug: 'pilha',
        titulo: "O que é uma pilha?",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>pilha</strong> é um Tipo Abstrato de Dados no qual o último elemento que entra é o primeiro que sai, sendo por isso denominada de estrutura <strong>LIFO</strong> (<em>Last In, First Out</em>).
                </p>
                <p className="mb-2">Podemos pensar em uma pilha de pratos ou de cartas de baralho, na qual só temos acesso e lidamos com o elemento que está no topo. As operações principais são:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Empilhar:</strong> Colocamos o próximo elemento sempre sobre o último, inserindo-o no topo da pilha.</li>
                    <li><strong>Desempilhar:</strong> Remove e retorna o elemento que está por cima de todos os outros (no topo).</li>
                </ul>
                <p>
                    Pilhas são amplamente utilizadas em computação para servir como uma espécie de memória de ações que podem ser revertidas, como ao buscar a saída de um labirinto, ou mesmo em compiladores para checar fechamento de parênteses e escopos de código.
                </p>
            </>
        )
    },
    {
        slug: 'arvore-binaria',
        titulo: "O que é uma Árvore Binária?",
        conteudo: (
            <>
                <p className="mb-2">
                    Uma <strong>árvore binária</strong> é uma estrutura de dados não linear formada por um conjunto finito de elementos chamados <strong>nós</strong>. Quando não está vazia, possui um nó principal chamado <strong>raiz</strong>, e os demais nós são divididos em dois subconjuntos: a subárvore esquerda e a subárvore direita.
                </p>
                <p className="mb-2">As características gerais de uma árvore binária incluem:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>Grau máximo 2:</strong> Cada nó pode ter, no máximo, dois filhos (um à esquerda e um à direita).</li>
                    <li><strong>Folhas:</strong> São os nós que ficam nas extremidades e não possuem nenhum filho (grau zero).</li>
                </ul>
                <p className="mb-2">Na sua variação mais utilizada, a <strong>Árvore Binária de Busca</strong>, os dados são organizados e inseridos seguindo uma regra fundamental de ordenação:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li><strong>À Esquerda:</strong> Todos os elementos presentes na subárvore esquerda possuem valores estritamente <strong>menores</strong> que o valor do nó atual.</li>
                    <li><strong>À Direita:</strong> Todos os elementos presentes na subárvore direita possuem valores <strong>maiores</strong> que o valor do nó atual.</li>
                </ul>
                <p>
                    Essa propriedade de ordenação garante que as operações de busca, inserção e remoção sejam extremamente eficientes, pois a cada descida na árvore, o algoritmo naturalmente descarta metade dos caminhos possíveis, similar a procurar uma palavra em um dicionário.
                </p>
            </>
        )
    },
    {
        slug: 'arvore-rubro-negra',
        titulo: "O que é uma Árvore Rubro-Negra?",
        conteudo: (
            <>
                <p className="mb-2">
                    A <strong>Árvore Rubro-Negra</strong> é uma árvore binária de busca autobalanceada, projetada para garantir eficiência contínua em operações de inserção, remoção e busca.
                </p>
                <p className="mb-2">Ela preserva o seu balanceamento atribuindo uma "cor" (vermelho ou preto) a cada nó e exigindo o cumprimento de propriedades matemáticas estritas:</p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li>A <strong>raiz</strong> da árvore é sempre preta.</li>
                    <li>Nós vermelhos não podem ter filhos vermelhos (não pode haver dois vermelhos consecutivos).</li>
                    <li>Todos os caminhos de um nó até suas folhas descendentes devem conter exatamente o mesmo número de nós pretos.</li>
                </ul>
                <p>
                    O seu balanceamento é um pouco menos rígido que o da árvore AVL. No entanto, isso faz com que a árvore Rubro-Negra exija menos reestruturações (rotações) durante atualizações frequentes, sendo amplamente utilizada no núcleo de sistemas operacionais e bibliotecas padrão de linguagens de programação.
                </p>
            </>
        )
    },
    {
        slug: 'arvore-avl',
        titulo: "O que é uma Árvore AVL?",
        conteudo: (
            <>
                <p className="mb-2">
                    A <strong>Árvore AVL</strong> (batizada com as iniciais de seus inventores, Adelson-Velsky e Landis) é uma árvore binária de busca rigorosamente <strong>balanceada</strong>.
                </p>
                <p className="mb-2">
                    Para evitar que os dados cresçam apenas para um lado e formem uma lista linear (o que deixaria as buscas muito lentas), a estrutura AVL impõe uma regra inquebrável baseada na altura dos nós:
                </p>
                <ul className="list-disc list-inside ml-4 mb-4">
                    <li>O <strong>Fator de Balanceamento</strong> (a diferença de altura entre a subárvore esquerda e a direita de qualquer nó) só pode ser <strong>-1, 0 ou 1</strong>.</li>
                </ul>
                <p>
                    Se uma inserção ou remoção de dado quebrar essa regra, a árvore dispara imediatamente operações de <strong>rotação</strong> (simples ou duplas) para consertar a estrutura. Isso garante que o tempo gasto para buscar qualquer elemento na árvore seja sempre o menor possível.
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