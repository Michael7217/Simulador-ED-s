
import Titulo from '../components/Titulo';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import VisualizadorFila from '../components/desenho/VisualizadorFila';
import VisualizadorPilha from '../components/desenho/VisualizadorPilha';
import VisualizadorLista from '../components/desenho/VisualizadorLista';
import VisualizadorABB from '../components/desenho/VisualizadorABB';
import VisualizadorAVL from '../components/desenho/VisualizadorAVL';
import VisualizadorARN from '../components/desenho/VisualizadorARN';

const visualizerMap = {
    'fila': VisualizadorFila,
    'pilha': VisualizadorPilha,
    'lista-encadeada': VisualizadorLista,
    'arvore': VisualizadorABB,
    'arvore-binaria': VisualizadorABB,
    'arvore-rn': VisualizadorARN,
    'arvore-avl': VisualizadorAVL,
};

export default function Simulacao(){
    const pagina = useLocation();
    const nome = pagina.pathname.split('/').pop();
    
    const Visualizer = visualizerMap[nome];

    const handleSuccess = (data) => {
        console.log('Operação bem-sucedida:', data);
    };

    return(
        <>
        <Titulo nome={nome}/>
        <div className='flex flex-col md:flex-row justify-around mx-6 gap-6 md:gap-0 mt-4 mb-8'>
            <div className='flex flex-col w-full md:w-2/3'>
                <h2 className='text-amarelo text-xl font-bold drop-shadow-xs mb-2 text-center [-webkit-text-stroke:0.8px_black]'>
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
                <h2 className='text-amarelo text-xl font-bold drop-shadow-xs mb-2 text-center [-webkit-text-stroke:0.8px_black]'>
                    Operações
                </h2>
                <div className='border-4 border-azul rounded-2xl w-full h-auto min-h-60 flex flex-col p-2 gap-2'>
                    <Button acao={acoes[0]} onSuccess={handleSuccess}>
                        <p>{acoes[0]}</p>
                    </Button>
                    <Button acao={acoes[1]} onSuccess={handleSuccess}>
                        <p>{acoes[1]}</p>
                    </Button>
                    <button className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'>
                        <p>{acoes[2]}</p>
                    </button>
                    <button className='border-2 rounded-2xl flex justify-center items-center text-xl font-medium text-amarelo p-2 bg-[rgba(0,0,0,0.2)] cursor-pointer'>
                        <p>{acoes[3]}</p>
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}