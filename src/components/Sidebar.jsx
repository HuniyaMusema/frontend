import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Menu,
  X,
  FileCheck,
  MessageSquare,
  Settings,
  User as UserIcon,
  Sun,
  Moon,
  Globe,
  LogOut,
  LayoutGrid,
  ListTodo
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { ROLES, hasPermission } from '../utils/permissions'

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()

  const allNavItems = [
    { name: t('projects'), path: '/app/projects', icon: FolderKanban, roles: [ROLES.ADMIN, ROLES.ARCHITECT, ROLES.CIVIL_ENGINEER, ROLES.ELECTRICAL_ENGINEER, ROLES.HYDRAULIC_ENGINEER, ROLES.CLIENT] },
    { name: t('tasks'), path: '/app/tasks', icon: ListTodo, roles: [ROLES.ADMIN, ROLES.ARCHITECT, ROLES.CIVIL_ENGINEER, ROLES.ELECTRICAL_ENGINEER, ROLES.HYDRAULIC_ENGINEER] },
    { name: t('team'), path: '/app/team', icon: Users, roles: [ROLES.ADMIN] },
    { name: t('messages'), path: '/app/messages', icon: MessageSquare, roles: [ROLES.ADMIN, ROLES.ARCHITECT, ROLES.CLIENT, ROLES.MESSENGER] },
    { name: t('profile'), path: '/app/profile', icon: UserIcon, roles: [ROLES.ADMIN, ROLES.ARCHITECT, ROLES.CIVIL_ENGINEER, ROLES.ELECTRICAL_ENGINEER, ROLES.HYDRAULIC_ENGINEER, ROLES.CLIENT, ROLES.MESSENGER] },
    { name: t('settings'), path: '/app/settings', icon: Settings, roles: [ROLES.ADMIN] },
  ]

  const navItems = allNavItems.filter(item => {
    if (!item.roles) return true
    return item.roles.includes(user?.role)
  })

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 dark:text-slate-200 rounded-lg shadow-md underline-offset-4"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 shadow-2xl z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Takamul</h1>
              <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest">Master System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 mt-6 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 font-bold scale-[1.02]'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-600'
                  }`
                }
              >
                <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110`} />
                <span className="text-sm uppercase tracking-wider font-extrabold">{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="p-6 space-y-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-around bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:text-primary-600 shadow-sm"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => changeLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-2 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:text-primary-600 shadow-sm"
              title="Change Language"
            >
              <Globe size={18} />
              <span className="text-xs font-black uppercase tracking-widest">{language}</span>
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all font-black uppercase tracking-widest text-xs border border-transparent hover:border-rose-100"
          >
            <LogOut size={18} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
