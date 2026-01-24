import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { mockAPI } from '../services/mockAPI'
import { Plus, Search, Mail, Phone, User as UserIcon, MoreHorizontal, UserPlus, X, MessageSquare, Edit, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROLES, hasPermission } from '../utils/permissions'

export default function Team() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [team, setTeam] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', role: 'architect', password: '' })
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, projectsData] = await Promise.all([
        mockAPI.getUsers(),
        mockAPI.getProjects(),
      ])
      setTeam(usersData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await mockAPI.signup(newMember.name, newMember.email, newMember.password, newMember.phone, newMember.role)
      if (result.success) {
        setTeam([...team, result.user])
        setShowAddMember(false)
        setNewMember({ name: '', email: '', phone: '', role: 'architect', password: '' })
      }
    } catch (err) {
      console.error('Error adding member:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeam = team.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
      case 'architect': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'client': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'messenger': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('team')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('manageTeam')}
          </p>
        </div>
        {hasPermission(user?.role, 'manage-users') && (
          <button
            onClick={() => setShowAddMember(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus size={18} />
            <span>{t('addMember')}</span>
          </button>
        )}
      </div>

      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">{t('member')}</th>
                <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">{t('role')}</th>
                <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">{t('contact')}</th>
                <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400">{t('joined')}</th>
                <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredTeam.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold uppercase">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-gray-400" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone size={14} className="text-gray-400" />
                        <span>{member.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right overflow-visible relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeDropdown === member.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                          <button
                            onClick={() => {
                              navigate('/app/messages')
                              setActiveDropdown(null)
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                          >
                            <MessageSquare size={16} />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Send Message</span>
                          </button>
                          <button
                            onClick={() => setActiveDropdown(null)}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                          >
                            <Eye size={16} />
                            <span className="font-bold uppercase tracking-widest text-[10px]">View Detail</span>
                          </button>
                          <button
                            onClick={() => setActiveDropdown(null)}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                          >
                            <Edit size={16} />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Edit Roles</span>
                          </button>
                          <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                          <button
                            onClick={() => setActiveDropdown(null)}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                          >
                            <Trash2 size={16} />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Archive User</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTeam.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <UserIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t('noTeamMembers')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal Simulation */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary-600 text-white">
              <h2 className="text-xl font-bold">{t('addMember')}</h2>
              <button onClick={() => setShowAddMember(false)} className="hover:bg-white/10 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  required
                  className="input-field w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('emailAddress')}</label>
                <input
                  type="email"
                  required
                  className="input-field w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={newMember.email}
                  onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('phoneNumber')}</label>
                <input
                  type="tel"
                  required
                  className="input-field w-full"
                  value={newMember.phone}
                  onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
                <input
                  type="password"
                  required
                  className="input-field w-full"
                  value={newMember.password}
                  onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('role')}</label>
                <select
                  className="input-field"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                >
                  <option value="project-manager">Project Manager</option>
                  <option value="architect">Architect</option>
                  <option value="civil-engineer">Civil Engineer</option>
                  <option value="electrical-engineer">Electrical Engineer</option>
                  <option value="hydraulic-engineer">Hydraulic Engineer</option>
                  <option value="messenger">Messenger</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddMember(false)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {t('cancel')}
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
