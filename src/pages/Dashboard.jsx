import { useEffect, useState, lazy, Suspense } from 'react'
import { mockAPI } from '../services/mockAPI'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { ROLES } from '../utils/permissions'

// Specialized Dashboard Components
import ProjectManagerDashboard from './dashboards/ProjectManagerDashboard'
import ClientDashboard from './dashboards/ClientDashboard'
import ArchitectDashboard from './dashboards/ArchitectDashboard'
import EngineerDashboard from './dashboards/EngineerDashboard'
import MessengerDashboard from './dashboards/MessengerDashboard'

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [statsData, projectsData, tasksData] = await Promise.all([
        mockAPI.getDashboardStats(user?.id, user?.role),
        mockAPI.getProjects(),
        mockAPI.getTasks(),
      ])
      setStats(statsData)

      // Filter data based on role for recent views
      let filteredProjects = projectsData
      let filteredTasks = tasksData

      if (user?.role === ROLES.CLIENT) {
        filteredProjects = projectsData.filter(p => p.clientId === user.id)
        filteredTasks = tasksData.filter(t => filteredProjects.some(p => p.id === t.projectId))
      } else if (user?.role !== ROLES.ADMIN && user?.role !== ROLES.MESSENGER) {
        filteredProjects = projectsData.filter(p => p.teamMembers.includes(user?.id) || p.managerId === user?.id)
        filteredTasks = tasksData.filter(t => t.assigneeId === user?.id)
      } else if (user?.role === ROLES.MESSENGER) {
        // Messenger might see everything but focused on approvals, handled in its dashboard
      }

      setProjects(filteredProjects)
      setTasks(filteredTasks)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'active':
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const dashboardProps = { user, stats, projects, tasks, t, getStatusColor }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-0.5">
            {t('overview')}
          </p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
            {t('projectsOverview')}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl text-sm font-bold border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {user?.role === ROLES.ADMIN && <ProjectManagerDashboard {...dashboardProps} />}
      {user?.role === ROLES.CLIENT && <ClientDashboard {...dashboardProps} />}
      {user?.role === ROLES.ARCHITECT && <ArchitectDashboard {...dashboardProps} />}
      {[ROLES.CIVIL_ENGINEER, ROLES.ELECTRICAL_ENGINEER, ROLES.HYDRAULIC_ENGINEER].includes(user?.role) && <EngineerDashboard {...dashboardProps} />}
      {user?.role === ROLES.MESSENGER && <MessengerDashboard {...dashboardProps} />}
    </div>
  )
}

