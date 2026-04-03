import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../layout/Layout'
import ListaEncadeada from '../pages/ListaEncadeada'

export default function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='/lista-encadeada' element={<ListaEncadeada/>}/>
            </Route>
        </Routes>
    )
}