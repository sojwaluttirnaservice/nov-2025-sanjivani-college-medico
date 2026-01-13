import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { instance } from '../../utils/instance'
import message from '../../utils/message'
import Container from '../../components/utils/Container'
import { setCredentials } from '../../redux/slices/authSlice'
import { Mail, Lock, UserCircle, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'

// Validation Schema
const loginSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: yup.string().required('Please select a role')
}).required()

const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const app = useSelector(state => state.app)
    const [showPassword, setShowPassword] = useState(false)

    // Role options (only PHARMACY and DELIVERY_AGENT)
    const roles = [
        { value: 'PHARMACY', label: 'Pharmacy', description: 'Manage pharmacy inventory' },
        { value: 'DELIVERY_AGENT', label: 'Delivery Agent', description: 'Handle deliveries' }
    ]
    
    // React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: 's@gmail.com',
            password: '123456',
            role: 'PHARMACY'
        }
    })

    // React Query Mutation
    const loginMutation = useMutation({
        mutationFn: async (data) => {
            return await instance.post('/users/login', data)
        },
        onSuccess: (response, variables) => {
            if (response.success) {
                // Dispatch credentials to Redux store (handles localStorage internally)
                dispatch(setCredentials({
                    user: response.data.user,
                    token: response.data.token
                }))

                message.success(response.message || 'Login successful!')

                // Redirect based on role
                setTimeout(() => {
                    switch (variables.role) {
                        case 'PHARMACY':
                            navigate('/pharmacy/dashboard')
                            break
                        case 'DELIVERY_AGENT':
                            navigate('/delivery/dashboard')
                            break
                        default:
                            navigate('/')
                    }
                }, 500)
            }
        },
        onError: (error) => {
            console.error('Login error:', error)
            // Error handling is managed by instance.js interceptor mostly, 
            // but we can add specific handling here if needed
        }
    })

    const onSubmit = (data) => {
        loginMutation.mutate(data)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-teal-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-3xl opacity-30"></div>

            <Container>
                <div className="max-w-md mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="bg-teal-600 text-white p-3 rounded-xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                Medo<span className="text-teal-600">Plus</span>
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Sign in to access your {app.name} account
                        </p>
                    </div>

                    {/* Login Form Card */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register('email')}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                                            } focus:ring-2 outline-none transition-all duration-300`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        {...register('password')}
                                        className={`w-full pl-12 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                                            } focus:ring-2 outline-none transition-all duration-300`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Role
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserCircle className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="role"
                                        {...register('role')}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.role ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                                            } focus:ring-2 outline-none transition-all duration-300 appearance-none bg-white cursor-pointer`}
                                    >
                                        <option value="">Choose your role...</option>
                                        {roles.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label} - {role.description}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                                {errors.role && (
                                    <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                        Remember me
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/auth/signup')}
                                    className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    Sign up now
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            By signing in, you agree to our{' '}
                            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default LoginPage