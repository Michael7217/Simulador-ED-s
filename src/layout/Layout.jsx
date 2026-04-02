import React, { useState } from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function Layout(){
    const [Est, SetEst] = useState(false)
    function AtivarMenu(){
        if(Est === false){
            SetEst(!Est)
        }else{
            SetEst(!Est)
        }
    }
    return(
        <>
            <Header funcao={AtivarMenu}/>
            <Sidebar estado={Est} funcao={AtivarMenu}/>
            <main>
                <Outlet/>
            </main>
            {/* <Footer/> */}
        </>
        )
    }
