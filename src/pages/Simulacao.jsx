
import Titulo from '../components/Titulo';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import VisualizadorFila from '../components/desenho/VisualizadorFila';
import VisualizadorPilha from '../components/desenho/VisualizadorPilha';
import VisualizadorLista from '../components/desenho/VisualizadorLista';
import VisualizadorABB from '../components/desenho/VisualizadorABB';
import VisualizadorAVL from '../components/desenho/VisualizadorAVL';

const visualizerMap = {
    'fila': VisualizadorFila,
    'pilha': VisualizadorPilha,
    'lista-encadeada': VisualizadorLista,
    'arvore': VisualizadorABB,
    'arvore-binaria': VisualizadorABB,
    'arvore-avl': VisualizadorAVL,
};

export default function Simulacao(){
    const pagina = useLocation();
    const nome = pagina.pathname.split('/').pop();
    
    const Visualizer = visualizerMap[nome];
    
    const acoes = [
        'Adicionar',
        'Remover',
        'Avançar',
        'Voltar'
    ];

    const handleSuccess = (data) => {
        console.log('Operação bem-sucedida:', data);
        // O visualizador recarrega automaticamente via useEffect
    };

    return(
        <>
        <Titulo nome={nome}/>
        <div className='w-screen flex gap-0 justify-around text-amarelo text-xl md:text-xl font-bold drop-shadow-xs'>
            <h2 className='pl-[20%] md:pl-[20%]'>Simulação</h2>
            <h2 className='pl-[7%]  md:pl-[15%]'>Operações</h2>
        </div>
        <div className='flex justify-around h-4/5 mx-6'>
            <div className='border-4 border-azul rounded-2xl h-screen w-2/3 overflow-hidden bg-white'>
                {Visualizer ? (
                    <Visualizer />
                ) : (
                    <div className='flex items-center justify-center h-full text-slate-400'>
                        Visualizador não disponível para esta estrutura
                    </div>
                )}
            </div>
            <div className='border-4 border-azul rounded-2xl w-2/10 h-60 flex flex-col'>
                <Button acao={acoes[0]} onSuccess={handleSuccess}>
                    <p>{acoes[0]}</p>
                </Button>
                <Button acao={acoes[1]} onSuccess={handleSuccess}>
                    <p>{acoes[1]}</p>
                </Button>
                <button acao={acoes[2]} className='border-2 rounded-2xl flex justify-center items-center text-2xs font-medium text-amarelo p-2 m-1 mt-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'>
                    <p>{acoes[2]}</p>
                </button>
                <button acao={acoes[3]} className='border-2 rounded-2xl flex justify-center items-center text-2xs font-medium text-amarelo p-2 m-1 mt-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'>
                    <p>{acoes[3]}</p>
                </button>
            </div>
        </div>
        </>
    )
}