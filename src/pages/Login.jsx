import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { LogIn, Mail, Lock, AlertCircle, Sun, Moon, Globe } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const { t, language, changeLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/app/projects')
      } else {
        setError(result.error || 'Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button
          onClick={() => changeLanguage(language === 'en' ? 'am' : 'en')}
          className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <Globe size={20} />
          <span className="text-sm font-medium uppercase">{language}</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-8 card dark:bg-gray-800 dark:border-gray-700 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary-600">
            Takamul PMS
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('signInToAccount')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center space-x-2 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn size={20} />
                <span>{t('signIn')}</span>
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('dontHaveAccount')}
              <Link to="/signup" className="ml-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
                {t('signUpHere')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
