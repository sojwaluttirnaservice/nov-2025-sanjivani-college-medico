import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Container from './utils/Container'
import { selectCurrentUser, selectIsAuthenticated, logout } from '../redux/slices/authSlice'
import message from '../utils/message'
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const user = useSelector(selectCurrentUser)

    const handleLogout = () => {
        dispatch(logout())
        message.success('Logged out successfully')
        navigate('/auth/login')
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <Container>
                <div className="py-4">
                    <div className="flex items-center justify-between">

                        {/* Logo Section */}
                        <Link to={'/'} className="flex items-center gap-2 group">
                            <div className="bg-teal-600 text-white p-2 rounded-lg group-hover:bg-teal-700 transition-colors">
                                {/* Simple cross/plus logo SVG */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Medo<span className="text-teal-600">Plus</span></span>
                        </Link>


                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8 font-medium text-gray-600">
                            <NavLink to={'/'} className={({ isActive }) => `hover:text-teal-600 transition-colors ${isActive ? 'text-teal-600' : ''}`}>Home</NavLink>
                            <NavLink to={'/about'} className={({ isActive }) => `hover:text-teal-600 transition-colors ${isActive ? 'text-teal-600' : ''}`}>About</NavLink>
                            <NavLink to={'/contact'} className={({ isActive }) => `hover:text-teal-600 transition-colors ${isActive ? 'text-teal-600' : ''}`}>Contact</NavLink>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex items-center gap-2 text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                        <div className="bg-teal-100 p-1 rounded-full text-teal-600">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{user?.email?.split('@')[0]}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-300"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <NavLink to={'/auth/login'} className="hidden sm:block text-gray-600 hover:text-teal-600 font-medium transition-colors">
                                        Log In
                                    </NavLink>
                                    <NavLink to={'/auth/signup'} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                        Join Now
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </nav>
    )
}

export default Navbar