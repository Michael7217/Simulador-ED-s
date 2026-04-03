import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../layout/Layout'
import ListaEncadeada from '../pages/ListaEncadeada'
import Conteudo from '../pages/PaginaEstrutura'
export default function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='/lista-encadeada' element={<ListaEncadeada/>}/>
                <Route path='/simulacao/:estrutura' element={<Conteudo/>}/>
            </Route>
        </Routes>
    )
}