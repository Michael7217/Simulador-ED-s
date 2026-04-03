import React, { useState, useEffect } from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

export default function Layout(){
    const [Est, SetEst] = useState(false)
    function AtivarMenu(){
        if(Est === false){
            SetEst(!Est)
        }else{
            SetEst(!Est)
        }
    }
    useEffect(()=>{
        if(Est == true){
            document.documentElement.style.overflow = 'hidden'
            document.body.style.overflow = 'hidden'
        }else{
            document.documentElement.style.overflow = 'auto'
            document.body.style.overflow = 'auto'
        }   
    },[Est])
    return(
        <>
            <Header funcao={AtivarMenu}/>
            <Sidebar estado={Est} funcao={AtivarMenu}/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
        )
    }
