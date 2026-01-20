import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { LogOut, User, Video } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-0.5">
            {t(user?.role)}
          </p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none group">
            {t('welcome')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">{user?.name}</span>
          </h2>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => alert(`Opening secure video call hub for ${user?.role.toUpperCase()}...`)}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-100 transition-all font-black text-xs uppercase tracking-widest border border-primary-100 dark:border-primary-800"
          >
            <Video size={16} />
            <span>{t('videoCall') || 'Video Call'}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-gray-700">{user?.name}</span>
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

