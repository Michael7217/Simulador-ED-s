import './App.css'
import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Titulo from './components/Titulo'
import Quadro from './components/Quadro'


function App() {

  return (
    <>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App
