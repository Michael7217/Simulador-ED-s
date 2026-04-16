import Titulo from '../components/Titulo';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Model from '../components/Model';
import ApresentacaoBuscar from '../components/apresentacaoBuscar';
import VisualizadorFila from '../components/desenho/VisualizadorFila';
import VisualizadorPilha from '../components/desenho/VisualizadorPilha';
import VisualizadorLista from '../components/desenho/VisualizadorLista';
import VisualizadorABB from '../components/desenho/VisualizadorABB';
import VisualizadorAVL from '../components/desenho/VisualizadorAVL';
import VisualizadorARN from '../components/desenho/VisualizadorARN';
import * as filaServices from '../services/filaservices';
import * as pilhaServices from '../services/pilhaServices';
import * as listaServices from '../services/listaservices';
import * as abbServices from '../services/abbServices';
import * as avlServices from '../services/avlServices';
import * as rnServices from '../services/rnServices';
import { useState } from 'react';

const visualizadormap = {
    'fila': VisualizadorFila,
    'pilha': VisualizadorPilha,
    'lista-encadeada': VisualizadorLista,
    'arvore': VisualizadorABB,
    'arvore-binaria': VisualizadorABB,
    'arvore-rubro-negra': VisualizadorARN,
    'arvore-avl': VisualizadorAVL,
};

const refazerDesfazer = {
    'fila': {
        'Refazer': filaServices.refazerFila,
        'Desfazer': filaServices.desfazerFila,
    },
    'pilha': {
        'Refazer': pilhaServices.refazerPilha,
        'Desfazer': pilhaServices.desfazerPilha,
    },
    'lista-encadeada': {
        'Refazer': listaServices.refazerLista,
        'Desfazer': listaServices.desfazerLista,
    },
    'arvore-binaria': {
        'Refazer': abbServices.refazerAbb,
        'Desfazer': abbServices.desfazerAbb,
    },
    'arvore-avl': {
        'Refazer': avlServices.refazerAvl,
        'Desfazer': avlServices.desfazerAvl,
    },
    'arvore-rubro-negra': {
        'Refazer': rnServices.refazerRn,
        'Desfazer': rnServices.desfazerRn,
    },
};

const estruturasNomes = {
    'fila': 'Fila',
    'pilha': 'Pilha',
    'lista-encadeada': 'Lista Encadeada',
    'arvore-binaria': 'Árvore Binária',
    'arvore-avl': 'Árvore AVL',
    'arvore-rubro-negra': 'Árvore Rubro-Negra',
};

const rotulosBotoes = {
    'fila': { adicionar: 'Enfileirar', remover: 'Desenfileirar' },
    'pilha': { adicionar: 'Empilhar', remover: 'Desempilhar' },
    'lista-encadeada': { adicionar: 'Adicionar', remover: 'Remover', buscar: 'Buscar' },
    'arvore-binaria': { adicionar: 'Inserir', remover: 'Remover', buscar: 'Buscar' },
    'arvore-avl': { adicionar: 'Inserir', remover: 'Remover', buscar: 'Buscar' },
    'arvore-rubro-negra': { adicionar: 'Inserir', remover: 'Remover', buscar: 'Buscar' },
};

export default function Simulacao() {
    const pagina = useLocation();
    let nome = pagina.pathname.split('/').pop();
    let nomeTitulo = estruturasNomes[nome] || nome;
    
    const [modalListaAberto, setModalListaAberto] = useState(false);
    const [tipoOperacaoLista, setTipoOperacaoLista] = useState('inicio');
    const [resultadoBusca, setResultadoBusca] = useState(null);
    const [modalBuscaAberto, setModalBuscaAberto] = useState(false);
    
    const Visualizer = visualizadormap[nome];
    const textoAdicionar = rotulosBotoes[nome]?.adicionar || 'Adicionar';
    const textoRemover = rotulosBotoes[nome]?.remover || 'Remover';
    const textoBuscar = rotulosBotoes[nome]?.buscar;

    const handleUndoRedo = async (acao) => {
        try {
            const serviceFunction = refazerDesfazer[nome]?.[acao];
            if (!serviceFunction) {
                throw new Error(`Serviço não encontrado para ${nome} - ${acao}`);
            }
            const response = await serviceFunction();
            handleSuccess(response.data);
        } catch (error) {
            console.error('Erro ao executar operação:', error);
            alert('Erro ao executar operação');
        }
    };

    const handleSuccess = (data) => {
        console.log('Operação bem-sucedida:', data);
        // Se for uma busca, armazenar resultado e abrir modal
        if (tipoOperacaoLista === 'Buscar Elemento') {
            setResultadoBusca(data);
            setModalBuscaAberto(true);
        }
        // O visualizador recarrega automaticamente via useEffect
    };

    return(
        <>
        <Titulo nome={nomeTitulo}/>
        <div className='flex flex-col md:flex-row justify-around mx-6 gap-6 md:gap-0 mt-4 mb-8'>
            <div className='flex flex-col w-full md:w-2/3'>
                <h2 className='text-amarelo text-xl font-bold drop-shadow-xs drop-shadow-black mb-2 text-center'>
                    Simulação
                </h2>
                <div className='border-4 border-azul rounded-2xl h-[60vh] md:h-screen w-full overflow-hidden bg-white'>
                    {Visualizer ? (
                        <Visualizer />
                    ) : (
                        <div className='flex items-center justify-center h-full text-slate-400'>
                            Visualizador não disponível para esta estrutura
                        </div>
                    )}
                </div>
            </div>

            <div className='flex flex-col w-full md:w-1/4'>
                <h2 className='text-amarelo text-xl font-bold drop-shadow-xs drop-shadow-black mb-2 text-center'>
                    Operações
                </h2>
                <div className='text-xl border-4 border-azul rounded-2xl w-full h-auto min-h-60 flex flex-col p-2 gap-2'>
                    {nome === 'lista-encadeada' ? (
                        <>
                            <button 
                                onClick={() => {
                                    setTipoOperacaoLista('Adicionar no Início');
                                    setModalListaAberto(true);
                                }} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Adicionar no Início</p>
                            </button>
                            <button 
                                onClick={() => {
                                    setTipoOperacaoLista('Adicionar no Meio');
                                    setModalListaAberto(true);
                                }} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Adicionar no Meio</p>
                            </button>
                            <button 
                                onClick={() => {
                                    setTipoOperacaoLista('Adicionar no Fim');
                                    setModalListaAberto(true);
                                }} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Adicionar no Fim</p>
                            </button>
                            <button 
                                onClick={() => {
                                    setTipoOperacaoLista('Adicionar Ordenado');
                                    setModalListaAberto(true);
                                }} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Adicionar Ordenado</p>
                            </button>
                            <button 
                                onClick={() => {
                                    setTipoOperacaoLista('Remover por Valor');
                                    setModalListaAberto(true);
                                }} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Remover por Valor</p>
                            </button>
                            <button 
                                onClick={() => {
                                    setTipoOperacaoLista('Remover por Posição');
                                    setModalListaAberto(true);
                                }} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Remover por Posição</p>
                            </button>
                            <button 
                                onClick={() => {
                                    setTipoOperacaoLista('Buscar Elemento');
                                    setModalListaAberto(true);
                                }} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Buscar Elemento</p>
                            </button>
                            <button 
                                onClick={() => handleUndoRedo('Refazer')} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Refazer</p>
                            </button>
                            <button 
                                onClick={() => handleUndoRedo('Desfazer')} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer hover:bg-amarelo/20 transition-colors'
                            >
                                <p>Desfazer</p>
                            </button>
                        </>
                    ) : (
                        <>
                            <Button acao="Adicionar" onSuccess={handleSuccess}>
                                <p>{textoAdicionar}</p>
                            </Button>
                            
                            <Button acao="Remover" onSuccess={handleSuccess}>
                                <p>{textoRemover}</p>
                            </Button>
                            
                            {textoBuscar && (
                                <Button acao="Buscar" onSuccess={handleSuccess}>
                                    <p>{textoBuscar}</p>
                                </Button>
                            )}
                            
                            <button 
                                onClick={() => handleUndoRedo('Refazer')} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'
                            >
                                <p>Refazer</p>
                            </button>
                            <button 
                                onClick={() => handleUndoRedo('Desfazer')} 
                                className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'
                            >
                                <p>Desfazer</p>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
        {nome === 'lista-encadeada' && (
            <Model 
                estado={modalListaAberto}
                funcao={setModalListaAberto}
                acao={tipoOperacaoLista}
                onSuccess={handleSuccess}
            />
        )}
        {nome === 'lista-encadeada' && (
            <ApresentacaoBuscar 
                estado={modalBuscaAberto}
                funcao={setModalBuscaAberto}
                resultado={resultadoBusca}
            />
        )}
        </>
    )
}