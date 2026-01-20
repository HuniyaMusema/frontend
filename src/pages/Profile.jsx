import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { User, Mail, Phone, Calendar, Save, CheckCircle2, AlertCircle, Shield } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        setMessage({ type: 'success', text: t('profileUpdated') })
      } else {
        setMessage({ type: 'error', text: result.error || t('failedUpdate') })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'architect': return 'Architect'
      case 'civil-engineer': return 'Civil Engineer'
      case 'electrical-engineer': return 'Electrical Engineer'
      case 'hydraulic-engineer': return 'Hydraulic Engineer'
      case 'client': return 'Client'
      case 'messenger': return 'Messenger'
      default: return role
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('profile')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card dark:bg-gray-800 dark:border-gray-700 text-center py-8">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getRoleDisplayName(user?.role)}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-lg flex items-center space-x-2 text-sm ${message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                  }`}>
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('emailAddress')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('phoneNumber')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-gray-400">
                    {t('role')} ({t('restricted')})
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-500" size={18} />
                    <input
                      type="text"
                      className="input-field pl-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-400 cursor-not-allowed w-full"
                      value={getRoleDisplayName(user?.role)}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{t('save')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
