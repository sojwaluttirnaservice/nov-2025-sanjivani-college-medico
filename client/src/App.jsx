import "./index.css"
import "./App.css"
import { Routes, Route } from 'react-router-dom'
import { ROLES } from './redux/slices/authSlice'

import RootLayout from './layouts/RootLayout'
import PharmacyLayout from './layouts/PharmacyLayout'
import DeliveryLayout from './layouts/DeliveryLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import HomePage from './pages/outer/HomePage'
import AboutPage from './pages/outer/AboutPage'
import ContactPage from './pages/outer/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import PharmacyDashboardPage from './pages/pharmacy/PharmacyDashboardPage'
import PharmacyInventoryPage from './pages/pharmacy/PharmacyInventoryPage'
import PharmacyOrdersPage from './pages/pharmacy/PharmacyOrdersPage'
import PharmacyProfilePage from './pages/pharmacy/PharmacyProfilePage'
import PharmacyPrescriptionReviewPage from './pages/pharmacy/PharmacyPrescriptionReviewPage'

import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage'
import DeliveryActivePage from './pages/delivery/DeliveryActivePage'
import DeliveryHistoryPage from './pages/delivery/DeliveryHistoryPage'
import DeliveryProfilePage from './pages/delivery/DeliveryProfilePage'

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

            {/* Pharmacy Layout (Sidebar + Topbar) */}
            <Route path='pharmacy' element={<PharmacyLayout />}>
                <Route element={<ProtectedRoute allowedRoles={[ROLES.PHARMACY]} />}>
                    <Route path='dashboard' element={<PharmacyDashboardPage />} />
                    <Route path='inventory' element={<PharmacyInventoryPage />} />
                    <Route path='orders' element={<PharmacyOrdersPage />} />
                    <Route path='profile' element={<PharmacyProfilePage />} />
                    <Route path='prescriptions/:id' element={<PharmacyPrescriptionReviewPage />} />
                </Route>
            </Route>

            {/* Delivery Layout (Sidebar + Topbar) */}
            <Route path='delivery' element={<DeliveryLayout />}>
                <Route element={<ProtectedRoute allowedRoles={[ROLES.DELIVERY_AGENT]} />}>
                    <Route path='dashboard' element={<DeliveryDashboardPage />} />
                    <Route path='active' element={<DeliveryActivePage />} />
                    <Route path='history' element={<DeliveryHistoryPage />} />
                    <Route path='profile' element={<DeliveryProfilePage />} />
                </Route>
            </Route>

        </Routes>
    )
}

export default App