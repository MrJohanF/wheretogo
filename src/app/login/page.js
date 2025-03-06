'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast'; 

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    // After first render, set isInitialLoad to false
    setIsInitialLoad(false);
    
    // Redirect if user is already authenticated
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const validateForm = () => {
    // Reset error
    setError('');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor introduce un email válido');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Additional registration validations
    if (!isLogin) {
      // Name validation
      if (fullName.trim().length < 3) {
        setError('Por favor introduce tu nombre completo');
        return false;
      }
      
      // Password confirmation
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return false;
      }
      
      // Terms acceptance
      if (!termsAccepted) {
        setError('Debes aceptar los términos y condiciones');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle login
        await login(email, password);
        toast.success('¡Inicio de sesión exitoso!');
        router.push('/');
      } else {
        // Handle registration
        await register(fullName, email, password);
        toast.success('¡Cuenta creada! Bienvenido/a.');
        router.push('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        isLogin 
          ? 'Correo o contraseña inválidos' 
          : err.message || 'Error al crear la cuenta'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setError('');
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4">
      {/* Back to Home Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6"
      >
        <Link 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
            Volver al inicio
          </span>
        </Link>
      </motion.div>
      
      <div className="w-full max-w-md">
        <LayoutGroup>
          <motion.div
            initial={{ opacity: isInitialLoad ? 0 : 1, y: isInitialLoad ? 20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            layout
            layoutId="auth-container"
          >
            {/* Card header with decoration */}
            <motion.div 
              className="h-2 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400"
              layoutId="header-decoration"
            ></motion.div>
            
            {/* Content area */}
            <motion.div 
              className="p-8 relative overflow-hidden"
              layout
              layoutId="content-area"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLogin ? (
                  <motion.div
                    key="login"
                    initial={!isInitialLoad ? { opacity: 0, x: -20 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                    layout
                  >
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Bienvenido de nuevo
                      </h1>
                      <p className="text-gray-500 mt-2">Inicia sesión para continuar</p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center text-sm"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Email field */}
                      <motion.div layout>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                            placeholder="tu@correo.com"
                          />
                        </div>
                      </motion.div>

                      {/* Password field */}
                      <motion.div layout>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Contraseña
                          </label>
                          <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                            ¿Olvidaste tu contraseña?
                          </a>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                            placeholder="••••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </motion.div>

                      {/* Remember me checkbox */}
                      <motion.div layout className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember_me"
                            name="remember_me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                            Recuérdame
                          </label>
                        </div>
                      </motion.div>

                      {/* Login button */}
                      <motion.div layout className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`group relative w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center ${
                            loading 
                              ? 'bg-indigo-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                          } shadow-sm hover:shadow-md active:shadow-inner disabled:opacity-75 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Iniciando sesión...</span>
                            </div>
                          ) : (
                            <>
                              <span className="relative z-10">Iniciar sesión</span>
                              <ArrowRight size={18} className="ml-2 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                            </>
                          )}
                        </button>
                      </motion.div>

                      {/* Social login divider */}
                      <motion.div layout className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">O continuar con</span>
                        </div>
                      </motion.div>

                      {/* Social buttons */}
                      <motion.div layout className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="py-2.5 px-4 flex justify-center items-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          <span className="ml-2 text-sm font-medium text-gray-700">GitHub</span>
                        </button>
                        <button
                          type="button"
                          className="py-2.5 px-4 flex justify-center items-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          <span className="ml-2 text-sm font-medium text-gray-700">Twitter</span>
                        </button>
                      </motion.div>
                    </form>
                    
                    <motion.p layout className="mt-8 text-center text-sm text-gray-600">
                      ¿Aún no tienes una cuenta?{' '}
                      <button 
                        onClick={toggleAuthMode} 
                        className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
                      >
                        Registrarse
                      </button>
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={!isInitialLoad ? { opacity: 0, x: 20 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                    layout
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        initial={!isInitialLoad ? { scale: 0.9, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                          Crea tu cuenta
                        </h1>
                        <p className="text-gray-500 mt-2">Regístrate para comenzar</p>
                      </motion.div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center text-sm"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Full name field */}
                      <motion.div layout>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                            placeholder="Tu nombre completo"
                          />
                        </div>
                      </motion.div>

                      {/* Email field */}
                      <motion.div layout>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                            placeholder="tu@correo.com"
                          />
                        </div>
                      </motion.div>

                      {/* Password field */}
                      <motion.div layout>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                            placeholder="Mínimo 8 caracteres"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </motion.div>

                      {/* Confirm password field */}
                      <motion.div layout>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar contraseña
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white"
                            placeholder="Confirmar contraseña"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </motion.div>

                      {/* Terms checkbox */}
                      <motion.div layout className="flex items-start mt-4">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            required
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="text-gray-700">
                            Acepto los <a href="#" className="text-indigo-600 hover:text-indigo-500">Términos</a> y la <a href="#" className="text-indigo-600 hover:text-indigo-500">Política de Privacidad</a>
                          </label>
                        </div>
                      </motion.div>

                      {/* Register button */}
                      <motion.div layout className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`group relative w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center ${
                            loading 
                              ? 'bg-indigo-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                          } shadow-sm hover:shadow-md active:shadow-inner disabled:opacity-75 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Registrando...</span>
                            </div>
                          ) : (
                            <>
                              <UserPlus size={18} className="mr-2" />
                              Crear cuenta
                            </>
                          )}
                        </button>
                      </motion.div>
                    </form>
                    
                    <motion.p layout className="mt-6 text-center text-sm text-gray-600">
                      ¿Ya tienes una cuenta?{' '}
                      <button 
                        onClick={toggleAuthMode} 
                        className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
                      >
                        Iniciar sesión
                      </button>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </LayoutGroup>
        
        <p className="text-center mt-6 text-sm text-gray-500">
          © 2023 WhereToGo. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}