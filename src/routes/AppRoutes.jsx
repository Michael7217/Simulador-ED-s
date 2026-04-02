import {Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../layout/Layout'

export default function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
            </Route>
        </Routes>
    )
}