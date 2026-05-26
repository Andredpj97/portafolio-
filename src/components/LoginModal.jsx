import { useState, useEffect, useRef } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import logoFarmacia from '../assets/logo minimalista farmacia.png'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.5-37.2-4.7-55.1H272v104.3h146.9c-6.3 34-25 62.8-53.3 82v68.1h86.1c50.4-46.4 81.8-115 81.8-199.3z"/>
    <path fill="#34A853" d="M272 544.3c72.6 0 133.6-24 178.1-65.3l-86.1-68.1c-24 16.1-54.6 25.6-92 25.6-70.7 0-130.6-47.6-152-111.6H28.6v70.1C73.1 480.9 167.4 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M120 324.5c-8.8-26.5-8.8-55 0-81.5V172.9H28.6c-39.3 78.6-39.3 171.9 0 250.5L120 324.5z"/>
    <path fill="#EA4335" d="M272 109.1c39.6 0 75.2 13.6 103.2 40.3l77.4-77.4C404.8 24 344 0 272 0 167.4 0 73.1 63.5 28.6 172.9l91.4 70.1C141.4 156.7 201.3 109.1 272 109.1z"/>
  </svg>
)

const LoginModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false)
  const modalRef = useRef(null)

  const ignoredAuthErrors = new Set([
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
  ])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      onClose()
    } catch (error) {
      if (!ignoredAuthErrors.has(error?.code) && import.meta.env.DEV) {
        console.error('Error en login:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-4" aria-modal="true" role="dialog">
      <div ref={modalRef} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 hover:shadow-lg">
        {/* Header con gradiente elegante */}
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 p-8 text-center relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
          </div>
          
          {/* Logo destacado */}
          <div className="relative z-10 flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-transform">
              <img src={logoFarmacia} alt="Logo Mi Farmacia" className="h-20 w-20 object-contain" />
            </div>
          </div>
          
          {/* Títulos */}
          <div className="relative z-10">
            <h2 className="text-white text-2xl font-bold mb-2">Bienvenido a Mi Farmacia</h2>
            <p className="text-green-50 text-sm font-medium">Accede a tu cuenta para continuar</p>
          </div>
          
          {/* Botón cerrar */}
          <button 
            onClick={onClose} 
            aria-label="Cerrar" 
            className="absolute top-6 right-6 z-20 text-white text-2xl hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed">
            Inicia sesión con tu cuenta de Google para acceder rápidamente a tu perfil y realizar compras.
          </p>

          {/* Botón Google mejorado */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3.5 px-6 hover:border-green-500 hover:shadow-md hover:bg-green-50/20 transition-all duration-200 font-medium text-gray-800 group"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 group-hover:scale-110 transition-transform">
              <GoogleIcon />
            </span>
            <span>{loading ? 'Conectando...' : 'Continuar con Google'}</span>
          </button>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Botón Cancelar */}
          <button 
            onClick={onClose} 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-200"
          >
            Cancelar
          </button>

          {/* Footer con términos */}
          <div className="mt-6 text-center text-xs text-gray-600 space-y-2">
            <p>
              Al iniciar sesión aceptas nuestros <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Términos</a> y la <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Política de Privacidad</a>.
            </p>
            <p className="text-gray-500">Tu seguridad es nuestra prioridad</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal