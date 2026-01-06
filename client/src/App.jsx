import React from 'react'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/outer/HomePage'
import AboutPage from './pages/outer/AboutPage'
import ContactPage from './pages/outer/ContactPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'

const App = () => {
    return (


        <Routes>

            <Route path='/' element={<RootLayout />}>

                <Route path='' index element={<HomePage />} />
                <Route path='about' element={<AboutPage />} />
                <Route path='contact' element={<ContactPage />} />


                <Route path='auth'>
                    <Route path='login' element={<LoginPage />} />
                </Route>

            </Route>

        </Routes>

    )
}

export default App