import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../layout/Layout'
import PaginaEstrutura from '../pages/PaginaEstrutura'

export default function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='/lista-encadeada' element={<PaginaEstrutura index={0} />}/>
                <Route path='/fila' element={<PaginaEstrutura index={1} />}/>
                <Route path='/arvore-binaria' element={<PaginaEstrutura index={2} />}/>
                <Route path='/pilha' element={<PaginaEstrutura index={3} />}/>
                <Route path='/arvore-avl' element={<PaginaEstrutura index={4} />}/>
                <Route path='/arvore' element={<PaginaEstrutura index={5} />}/>
            </Route>
        </Routes>
    )
}