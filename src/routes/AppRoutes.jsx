import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../layout/Layout'
import Simulacao from '../pages/Simulacao'
import Conteudo from '../pages/Conceito'
import Sobre from '../pages/Sobre'

export default function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='simulacao/:estrutura' element={<Simulacao/>}/>
                <Route path='conceito/:estrutura' element={<Conteudo/>}/>
                <Route path='sobre' element={<Sobre/>}/>
            </Route>
        </Routes>
    )
}