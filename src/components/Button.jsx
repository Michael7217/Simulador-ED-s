import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Model from './Model'

export default function Button(props){
    const [estado, setEstado] = useState(false)

    return(
        <>
            <Link onClick={()=>{setEstado(!estado)}} className='border-2 rounded-2xl flex justify-center items-center text-2xs font-medium text-amarelo p-2 m-1 mt-2 bg-[rgba(0,0,0,0.2)]'>
                <button className='cursor-pointer'>
                    {props.children}
                </button>
            </Link>
            <Model acao={props.acao} estado={estado} funcao={setEstado}/>
            
        </>
    )
}