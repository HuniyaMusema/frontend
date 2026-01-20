import { useState, useEffect } from 'react'
import { mockAPI } from '../services/mockAPI'
import { X } from 'lucide-react'

export default function ProjectModal({ project, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    managerId: '',
    clientId: '',
    teamMembers: [],
    paymentStatus: 'pending',
    clientPrePayment: false,
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        managerId: project.managerId || '',
        clientId: project.clientId || '',
        teamMembers: project.teamMembers || [],
        paymentStatus: project.paymentStatus || 'pending',
        clientPrePayment: project.clientPrePayment || false,
      })
    } else {
      // Set default dates
      const today = new Date().toISOString().split('T')[0]
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      setFormData(prev => ({
        ...prev,
        startDate: today,
        endDate: nextMonth.toISOString().split('T')[0],
      }))
    }
  }, [project])

  const loadUsers = async () => {
    const data = await mockAPI.getUsers()
    setUsers(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Payment trigger: Project can only be 'active' if clientPrePayment is true
      let finalFormData = { ...formData }
      if (finalFormData.status === 'active' && !finalFormData.clientPrePayment) {
        setError('Project cannot be activated until client pre-payment is confirmed.')
        setLoading(false)
        return
      }

      if (project) {
        await mockAPI.updateProject(project.id, finalFormData)
        // If payment status changed, update it
        if (finalFormData.paymentStatus !== project.paymentStatus || 
            finalFormData.clientPrePayment !== project.clientPrePayment) {
          await mockAPI.updateProjectPayment(
            project.id,
            finalFormData.paymentStatus,
            finalFormData.clientPrePayment
          )
        }
      } else {
        // New projects start as 'planning' and require payment to become 'active'
        finalFormData.status = 'planning'
        await mockAPI.createProject(finalFormData)
      }
      onClose()
    } catch (err) {
      setError('Failed to save project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTeamMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(userId)
        ? prev.teamMembers.filter(id => id !== userId)
        : [...prev.teamMembers, userId],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
                required
              >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {formData.status === 'active' && !formData.clientPrePayment && (
              <p className="text-xs text-red-600 mt-1">Note: Client pre-payment must be confirmed to activate project</p>
            )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input-field"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select a client</option>
              {users.filter(u => u.role === 'client').map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Manager *
            </label>
            <select
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select a manager (Admin)</option>
              {users.filter(u => u.role === 'admin').map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          {/* Payment Section */}
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <h3 className="font-semibold text-gray-800">Payment Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="input-field"
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="clientPrePayment"
                checked={formData.clientPrePayment}
                onChange={(e) => setFormData({ ...formData, clientPrePayment: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="clientPrePayment" className="text-sm font-medium text-gray-700">
                Client Pre-payment Confirmed (Required to activate project)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              {users.map(user => (
                <label key={user.id} className="flex items-center space-x-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.teamMembers.includes(user.id)}
                    onChange={() => handleTeamMemberToggle(user.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{user.name} ({user.role})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

