import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
    return (
        <div id='main-wrapper' className='main-wrapper'>
            <Navbar />

            <main>
                {/* content */}
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default RootLayout