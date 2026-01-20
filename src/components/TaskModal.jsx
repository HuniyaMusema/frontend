import { useState, useEffect } from 'react'
import { mockAPI } from '../services/mockAPI'
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function TaskModal({ task, projects, onClose }) {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigneeId: '',
    dueDate: '',
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    loadUsers()
    if (task) {
      setFormData({
        projectId: task.projectId || '',
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate || '',
      })
    } else {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      setFormData(prev => ({
        ...prev,
        dueDate: nextWeek.toISOString().split('T')[0],
        projectId: projects.length > 0 ? projects[0].id : '',
      }))
    }
  }, [task, projects])

  const loadUsers = async () => {
    const data = await mockAPI.getUsers()
    setUsers(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (task) {
        await mockAPI.updateTask(task.id, formData)
      } else {
        await mockAPI.createTask(formData)
      }
      onClose()
    } catch (err) {
      setError('Failed to save task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setUploadSuccess(true)
      setFormData(prev => ({ ...prev, status: 'completed' }))
    }, 2000)
  }

  const isEngineer = ['architect', 'civil-engineer', 'electrical-engineer', 'hydraulic-engineer'].includes(user?.role)
  const isAssignee = task?.assigneeId === user?.id

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {task ? t('edit_task') || 'Edit Task' : t('new_task') || 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Task Title' : 'የተግባር ርዕስ'} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Project' : 'ፕሮጀክት'} *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Due Date' : 'የማብቂያ ቀን'} *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Description' : 'መግለጫ'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Status' : 'ሁኔታ'} *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {language === 'en' ? 'Priority' : 'ቅድሚያ'} *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {!isEngineer && (
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Assign To' : 'ለማን ተመደበ'}
                </label>
                <select
                  value={formData.assigneeId}
                  onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {isEngineer && isAssignee && (
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-200 dark:border-primary-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-primary-800 dark:text-primary-300">
                  {language === 'en' ? 'Simulation: Upload Final Document' : 'ሲሙሌሽን፡ የመጨረሻ ሰነድ ይስቀሉ'}
                </h3>
                {uploadSuccess && <CheckCircle2 className="text-green-500" />}
              </div>
              <p className="text-sm text-primary-700 dark:text-primary-400">
                {language === 'en' ? 'Uploading a document will automatically mark this task as completed.' : 'ሰነድ መስቀል ይህንን ተግባር በራስ-ሰር እንደተጠናቀቀ ያመለክታል።'}
              </p>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || uploadSuccess}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-b-white"></div>
                    <span>{language === 'en' ? 'Uploading...' : 'በመስቀል ላይ...'}</span>
                  </div>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>{language === 'en' ? 'Simulate Upload' : 'ስቀል (ሲሙሌሽን)'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3 bg-gray-50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold transition-colors"
            disabled={loading}
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary px-8"
            disabled={loading || uploading}
          >
            {loading ? '...' : task ? t('save_changes') || 'Update Task' : t('create') || 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
