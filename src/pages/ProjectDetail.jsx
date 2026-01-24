import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { mockAPI } from '../services/mockAPI'
import {
  Calendar, Clock, User, CheckCircle2, AlertCircle,
  ArrowLeft, MoreVertical, Plus, FileText, Download,
  Settings, Users, BarChart3, Layers, Receipt, ShieldCheck, MessageSquare
} from 'lucide-react'
import { hasPermission } from '../utils/permissions'
import VideoChatLauncher from '../components/VideoChatLauncher'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjectDetails()
  }, [id])

  const loadProjectDetails = async () => {
    try {
      if (!id) return
      const [projData, tasksData, allUsers] = await Promise.all([
        mockAPI.getProject(id),
        mockAPI.getTasks(),
        mockAPI.getUsers()
      ])
      setProject(projData)
      setTasks(tasksData.filter(t => t.projectId === id))

      // Filter team members based on project's teamMembers array
      const projectTeam = allUsers.filter(u => projData.teamMembers.includes(u.id) || projData.managerId === u.id)
      setTeamMembers(projectTeam)
    } catch (error) {
      console.error('Error loading project details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'on-hold': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const isClient = user?.role === 'client'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('projectNotFound')}</h2>
        <button onClick={() => navigate('/projects')} className="mt-6 btn-primary">
          {t('backToProjects')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors font-bold group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('backToProjects')}</span>
        </button>
        <div className="flex items-center space-x-2">
          {hasPermission(user?.role, 'edit-project') && (
            <button
              onClick={() => alert(t('editProjectSettings') || 'Opening Project Settings...')}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Settings size={20} className="text-gray-500" />
            </button>
          )}
          <button
            onClick={() => alert('Opening more options...')}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <MoreVertical size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Layers size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 inline-block shadow-sm ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">{project.name}</h1>
                </div>
                {isClient && project.status === 'completed' && project.fullPaymentVerified && (
                  <button
                    onClick={() => alert(`Downloading final files for ${project.name}...`)}
                    className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-primary-600/20"
                  >
                    <Download size={18} />
                    <span>{t('downloadFinal')}</span>
                  </button>
                )}
                {isClient && project.status === 'completed' && !project.fullPaymentVerified && (
                  <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl">
                    <AlertCircle size={18} />
                    <span className="text-sm font-bold uppercase tracking-tight">Full Payment Required for Download</span>
                  </div>
                )}
                {user?.role === 'architect' && !project.sketchApproved && (
                  <button
                    onClick={() => alert('Approval request sent to Admin & Client.')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FileText size={18} />
                    <span>Request Sketch Approval</span>
                  </button>
                )}
                {[ROLES.ADMIN, ROLES.PROJECT_MANAGER].includes(user?.role) && project.sketchApproved && !project.architecturalApproved && (
                  <button
                    onClick={() => alert('Architectural design approved successfully.')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Approve Architectural Design</span>
                  </button>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10 max-w-3xl">
                {project.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('startDate')}</p>
                  <div className="flex items-center space-x-2.5 text-gray-800 dark:text-gray-200">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Calendar size={14} className="text-gray-500" />
                    </div>
                    <span className="font-bold text-sm">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('targetDate')}</p>
                  <div className="flex items-center space-x-2.5 text-gray-800 dark:text-gray-200">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Clock size={14} className="text-gray-500" />
                    </div>
                    <span className="font-bold text-sm">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('priority')}</p>
                  <div className={`flex items-center space-x-2.5 font-bold text-sm group ${project.priority === 'high' ? 'text-red-500' : project.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                    <div className="p-1.5 bg-current bg-opacity-10 rounded-lg">
                      <AlertCircle size={14} />
                    </div>
                    <span className="capitalize">{project.priority}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('overallProgress')}</p>
                  <div className="flex items-center space-x-2.5 text-primary-600 dark:text-primary-400 font-extrabold text-sm">
                    <div className="p-1.5 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                      <BarChart3 size={14} />
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-gray-100 dark:bg-gray-700/50 rounded-full h-3 w-full overflow-hidden shadow-inner">
                <div
                  className="bg-primary-600 h-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${project.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {!isClient ? (
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-xl">
                    <Layers size={22} className="text-primary-600" />
                  </div>
                  <span>{t('tasks')}</span>
                </h2>
                {hasPermission(user?.role, 'create-task') && (
                  <button
                    onClick={() => alert('Opening New Task modal...')}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-extrabold flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl transition-all"
                  >
                    <Plus size={18} />
                    <span>{t('newTask')}</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <p className="font-bold">No tasks found for this project</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/20 rounded-2xl hover:bg-white dark:hover:bg-gray-700/40 hover:shadow-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600 group">
                      <div className="flex items-center space-x-5">
                        {task.status === 'completed' ? (
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={16} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 group-hover:border-primary-500 transition-colors"></div>
                        )}
                        <div>
                          <h4 className={`font-bold text-gray-800 dark:text-gray-200 ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>{task.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-10">
                        <div className="hidden md:flex flex-col items-end">
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{t('dueDate')}</span>
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="card dark:bg-gray-800 dark:border-gray-700 p-12 text-center bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/5">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400 shadow-lg">
                <BarChart3 size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4 dark:text-white">Project Progress Summary</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                Your project is currently <span className="text-primary-600 dark:text-primary-400 font-black">{project.progress}%</span> complete. Our team of experts is working diligently on the next milestones.
              </p>
            </div>
          )}

          {/* Receipt Section */}
          {(isClient || [ROLES.ADMIN, ROLES.PROJECT_MANAGER].includes(user?.role)) && (
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl">
                    <Receipt size={22} className="text-green-600" />
                  </div>
                  <span>{t('paymentVerification')}</span>
                </h2>
                <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${project.receiptVerified ? 'bg-green-100 text-green-700' : project.receiptUrl ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {project.receiptVerified ? 'Verified' : project.receiptUrl ? 'Pending Verification' : 'Payment Required'}
                </span>
              </div>

              {isClient && !project.receiptUrl && (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500 mb-6 font-medium">Please upload your payment receipt to initiate the project design phase.</p>
                  <button
                    onClick={() => {
                      const url = prompt('Enter receipt image URL (simulated):', 'https://images.unsplash.com/photo-1554224155-1696413565d3')
                      if (url) {
                        mockAPI.uploadReceipt(project.id, url).then(updated => setProject(updated))
                      }
                    }}
                    className="btn-primary"
                  >
                    Upload Receipt
                  </button>
                </div>
              )}

              {project.receiptUrl && (
                <div className="space-y-6">
                  <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={project.receiptUrl} alt="Payment Receipt" className="w-full h-full object-cover" />
                  </div>

                  {[ROLES.ADMIN, ROLES.PROJECT_MANAGER].includes(user?.role) && !project.receiptVerified && (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => mockAPI.verifyReceipt(project.id, true).then(updated => setProject(updated))}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <ShieldCheck size={20} />
                        <span>VERIFY PAYMENT</span>
                      </button>
                      <button
                        onClick={() => alert('Payment rejected. Please explain to client.')}
                        className="flex-1 bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/50 font-black py-4 rounded-2xl hover:bg-red-50 transition-all"
                      >
                        REJECT
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Global Communication Launcher */}
          <VideoChatLauncher role={user?.role} />
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                <Users size={22} className="text-blue-600" />
              </div>
              <span>{t('projectTeam')}</span>
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-full">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('projectManager')}</p>
                  <div className="flex items-center space-x-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                      {teamMembers.find(m => m.id === project.managerId)?.name.charAt(0) || 'PM'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">
                        {teamMembers.find(m => m.id === project.managerId)?.name || 'Project Manager'}
                      </p>
                      <p className="text-xs text-primary-600 font-bold uppercase tracking-widest">
                        {teamMembers.find(m => m.id === project.managerId)?.role || 'Manager'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('teamMembers')}</p>
                <div className="space-y-4">
                  {teamMembers.filter(m => m.role !== 'admin' && m.role !== 'client').map((member, i) => (
                    <div key={i} className="flex items-center space-x-4 group p-1">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 block truncate">{member.name}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{member.role}</span>
                      </div>
                      <button
                        onClick={() => navigate('/app/messages')}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                        title="Send Message"
                      >
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  ))}
                  {teamMembers.length <= 1 && (
                    <p className="text-xs text-gray-400 italic">No other team members assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isClient && (
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                    <FileText size={22} className="text-orange-600" />
                  </div>
                  <span>{t('documents')}</span>
                </h2>
              </div>
              <div className="space-y-3">
                {['Architectural_Drawing.pdf', 'Structural_Analysis.docx', 'Client_Brief.pdf'].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl group hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all border border-transparent hover:border-primary-200 dark:hover:border-primary-800">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <FileText size={16} className="text-gray-400 group-hover:text-primary-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{doc}</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${doc}...`)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert('Opening Document Uploader...')}
                className="w-full mt-8 py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center space-x-3 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                <span className="font-extrabold">{t('uploadDocument')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
