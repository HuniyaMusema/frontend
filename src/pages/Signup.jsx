import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { UserPlus, Sun, Moon, Globe, Mail, Phone, Lock, User, AlertCircle } from 'lucide-react'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useAuth()
  const { t, language, changeLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signup(formData)
      if (result.success) {
        navigate('/app/projects')
      } else {
        setError(result.error || 'Signup failed. Email might already be in use.')
      }
    } catch (err) {
      setError('An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md text-gray-600 dark:text-gray-400 transition-all group"
        >
          {theme === 'light' ? <Moon size={20} className="group-hover:rotate-12 transition-transform" /> : <Sun size={20} className="group-hover:rotate-90 transition-transform" />}
        </button>
        <button
          onClick={() => changeLanguage(language === 'en' ? 'am' : 'en')}
          className="flex items-center space-x-2 p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md text-gray-600 dark:text-gray-400 transition-all font-bold"
        >
          <Globe size={18} className="text-primary-600" />
          <span className="text-xs uppercase tracking-widest">{language}</span>
        </button>
      </div>

      <div className="max-w-md w-full p-8 card dark:bg-gray-800 dark:border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary-600"></div>
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-primary-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Takamul PMS
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
            {t('createYourAccount')}
          </p>
          <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-xl">
            <p className="text-[11px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-tight leading-tight">
              {t('clientSignupOnly')}
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('role')}
              </label>
              <input
                type="text"
                value="Client"
                disabled
                className="input-field bg-slate-50 dark:bg-slate-900 cursor-not-allowed font-black uppercase text-xs"
              />
              <p className="mt-2 text-[10px] text-amber-600 font-bold uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                {t('clientOnlyNotice') || 'Self-registration is restricted to Clients only. Team members must be registered by a Project Manager.'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                {t('fullName')}
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full py-3 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                {t('emailAddress')}
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full py-3 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                {t('phoneNumber')}
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full py-3 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="+968 9xxx xxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                {t('password')}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full py-3 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-4 mt-8 shadow-lg hover:shadow-primary-600/30 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus size={20} />
                <span className="font-extrabold uppercase tracking-widest">{t('createAccount')}</span>
              </>
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-bold">
              {t('alreadyHaveAccount')}
              <Link to="/login" className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                {t('signInHere')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
