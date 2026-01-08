import "./index.css"
import "./App.css"
import { Routes, Route } from 'react-router-dom'
import { ROLES } from './redux/slices/authSlice'

import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import HomePage from './pages/outer/HomePage'
import AboutPage from './pages/outer/AboutPage'
import ContactPage from './pages/outer/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import PharmacyDashboardPage from './pages/pharmacy/PharmacyDashboardPage'
import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage'

const App = () => {
    return (
        <Routes>

            {/* Public Layout (With Footer) */}
            <Route path='/' element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path='about' element={<AboutPage />} />
                <Route path='contact' element={<ContactPage />} />

                <Route path='auth'>
                    <Route path='login' element={<LoginPage />} />
                    <Route path='signup' element={<SignupPage />} />
                </Route>
            </Route>

            {/* Protected Dashboard Layout (No Footer) */}
            <Route element={<DashboardLayout />}>

                {/* Pharmacy Routes */}
                <Route path='pharmacy'>
                    <Route
                        path='dashboard'
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.PHARMACY]}>
                                <PharmacyDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Delivery Routes */}
                <Route path='delivery'>
                    <Route
                        path='dashboard'
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.DELIVERY_AGENT]}>
                                <DeliveryDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Route>

        </Routes>
    )
}

export default App