import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { mockAPI } from '../services/mockAPI'
import {
  Plus, Search, Filter, Calendar, CheckSquare, Clock,
  AlertCircle, ChevronRight, User, Tag, Upload, FileText, CheckCircle2, X
} from 'lucide-react'
import { ROLES, hasPermission } from '../utils/permissions'

export default function Tasks() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMilestone, setFilterMilestone] = useState('all')
  const [uploadingTask, setUploadingTask] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      if (!user) return
      const [tasksData, projectsData] = await Promise.all([
        mockAPI.getTasks(),
        mockAPI.getProjects(),
      ])

      // Filter tasks based on role
      let filtered = tasksData
      if (['architect', 'civil-engineer', 'electrical-engineer', 'hydraulic-engineer'].includes(user.role)) {
        filtered = tasksData.filter(t => t.assigneeId === user.id)
      } else if (user.role === 'client') {
        const clientProjects = projectsData.filter(p => p.clientId === user.id).map(p => p.id)
        filtered = tasksData.filter(t => clientProjects.includes(t.projectId))
      }

      setTasks(filtered)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = (taskId) => {
    setUploadingTask(taskId)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploadingTask(null)
            // Update task status in UI
            setTasks(prevTasks => prevTasks.map(task =>
              task.id === taskId ? { ...task, status: 'completed' } : task
            ))
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || 'Unknown Project'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'on-hold': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesMilestone = filterMilestone === 'all' || task.milestone === filterMilestone
    return matchesSearch && matchesStatus && matchesMilestone
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('tasks')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('manageTasks')}
          </p>
        </div>
        {hasPermission(user?.role, 'create-task') && (
          <button className="btn-primary flex items-center space-x-2">
            <Plus size={18} />
            <span>{t('newTask')}</span>
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <Filter size={18} className="text-gray-400" />
          <select
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2 min-w-[150px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">{t('allStatus')}</option>
            <option value="todo">{t('toDo')}</option>
            <option value="in-progress">{t('inProgress')}</option>
            <option value="completed">{t('approved')}</option>
            <option value="on-hold">{t('onHold')}</option>
          </select>

          <select
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2 min-w-[150px]"
            value={filterMilestone || 'all'}
            onChange={(e) => setFilterMilestone(e.target.value === 'all' ? null : e.target.value)}
          >
            <option value="all">All Milestones</option>
            {[...new Set(tasks.map(t => t.milestone).filter(Boolean))].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="card dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-all border-t-4 border-t-primary-600 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <div className="flex items-center text-xs font-bold">
                <div className={`w-2 h-2 rounded-full mr-1.5 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                <span className={`uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>{task.priority}</span>
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary-600 transition-colors">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 h-10">{task.description}</p>

            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Tag size={14} className="mr-2 text-primary-500" />
                <span className="font-bold text-primary-600 dark:text-primary-400">{getProjectName(task.projectId)}</span>
                {task.milestone && (
                  <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-500 uppercase tracking-tighter">
                    {task.milestone}
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={14} className="mr-2" />
                <span className="font-medium">{t('dueDate')}: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                    <User size={12} />
                  </div>
                  <span className="font-semibold">{task.assigneeId === user?.id ? t('assignedToYou') : t('teamMember')}</span>
                </div>
                {['architect', 'civil-engineer', 'electrical-engineer', 'hydraulic-engineer'].includes(user?.role) && task.assigneeId === user?.id && task.status !== 'completed' && (
                  <button
                    onClick={() => handleUpload(task.id)}
                    disabled={uploadingTask === task.id}
                    className="flex items-center space-x-1.5 text-xs bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-3 py-1.5 rounded-lg font-extrabold transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{t('upload')}</span>
                  </button>
                )}
                {task.status === 'completed' && (
                  <div className="text-green-600 dark:text-green-400 flex items-center space-x-1 font-bold text-xs">
                    <CheckCircle2 size={16} />
                    <span>Submitted</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Overlay Simulation */}
            {uploadingTask === task.id && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-primary-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Uploading Document... {uploadProgress}%</p>
              </div>
            )}
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="col-span-full card text-center py-20 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/20 border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={32} className="opacity-20" />
            </div>
            <p className="font-bold text-lg">No tasks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
