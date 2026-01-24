import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { mockAPI } from '../services/mockAPI'
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, DollarSign } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'
import { hasPermission, ROLES } from '../utils/permissions'

export default function Projects() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [user])

  const loadProjects = async () => {
    try {
      let data = await mockAPI.getProjects()

      if (user?.role === ROLES.CLIENT) {
        data = data.filter(p => p.clientId === user.id)
      } else if (user?.role !== ROLES.ADMIN && user?.role !== ROLES.MESSENGER) {
        data = data.filter(p => p.teamMembers.includes(user?.id) || p.managerId === user?.id)
      }

      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const canCreate = hasPermission(user?.role, 'create-project')
  const canEdit = hasPermission(user?.role, 'edit-project')
  const canDelete = hasPermission(user?.role, 'delete-project')
  const isClient = user?.role === ROLES.CLIENT

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await mockAPI.deleteProject(id)
      loadProjects()
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingProject(null)
    loadProjects()
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('projects')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isClient ? 'Your projects' : 'Manage all your projects'}
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>{t('newProject')}</span>
          </button>
        )}
      </div>

      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="all">{t('all')}</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="card dark:bg-gray-800 dark:border-gray-700 text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noProjects')}</p>
          {canCreate && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-4"
            >
              {t('newProject')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card dark:bg-gray-800 dark:border-gray-700 group hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link
                    to={`/app/projects/${project.id}`}
                    className="text-xl font-semibold text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {project.name}
                  </Link>
                  {!isClient && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                  )}
                </div>
                {(canEdit || canDelete) && (
                  <div className="relative group/menu">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <MoreVertical size={18} className="text-gray-400" />
                    </button>
                    <div className="hidden group-hover/menu:block absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(project)}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg dark:text-gray-300"
                        >
                          <Edit size={16} />
                          <span>{t('edit')}</span>
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 rounded-b-lg"
                        >
                          <Trash2 size={16} />
                          <span>{t('delete')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {!isClient && (
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`text-sm font-medium ${project.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {project.priority} priority
                    </span>
                  </div>
                )}

                {isClient && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign size={16} className={project.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'} />
                    <span className={project.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                      Payment: {project.paymentStatus || 'pending'}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{t('completionRate')}</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('dueDate')}: {new Date(project.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

