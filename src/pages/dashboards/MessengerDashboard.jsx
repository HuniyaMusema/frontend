import { useNavigate } from 'react-router-dom'
import { FileCheck, Clock, AlertCircle, CheckCircle2, XCircle, MessageCircle, MessageSquare } from 'lucide-react'
import StatCard from '../../components/StatCard'
import { useState } from 'react'
import { mockAPI } from '../../services/mockAPI'
import FileUpload from '../../components/FileUpload'
import { ChevronRight } from 'lucide-react'

export default function MessengerDashboard({ user, stats, projects, tasks, t, getStatusColor }) {
    const navigate = useNavigate()
    const [selectedProject, setSelectedProject] = useState(null)
    const [status, setStatus] = useState('pending')
    const [comment, setComment] = useState('')

    const handleUpdateStatus = async (projectId) => {
        if (status === 'denied' && !comment.trim()) {
            alert('Mandatory Comment box if Denied')
            return
        }

        try {
            // Update project status in mockAPI
            const updatedStatus = status === 'approved' ? 'active' : 'planning'
            await mockAPI.updateProject(projectId, {
                status: updatedStatus,
                architecturalApproved: status === 'approved'
            })

            // Also create a government approval record
            await mockAPI.updateApprovalStatus(
                projectId,
                status,
                comment,
                user.id
            )

            alert('Government status updated successfully!')
            setSelectedProject(null)
            setComment('')
            // Force a reload of the parent dashboard would be better, but for now this confirms the action
            window.location.reload()
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Failed to update status')
        }
    }

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('pendingApprovals')} value={projects.filter(p => !p.architecturalApproved).length} icon={Clock} color="yellow" />
                <StatCard title={t('totalSubmissions')} value={projects.length} icon={FileCheck} color="primary" />
                <StatCard title={t('deniedItems')} value={0} icon={AlertCircle} color="rose" />
                <button
                    onClick={() => navigate('/app/messages')}
                    className="card flex items-center justify-between p-6 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group border-l-4 border-l-primary-600"
                >
                    <div className="flex items-center space-x-3">
                        <MessageSquare className="text-primary-600" size={24} />
                        <div>
                            <p className="text-sm font-black dark:text-white uppercase tracking-tight">Open Messaging</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Connect with team</p>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="card dark:bg-slate-800">
                <h2 className="text-2xl font-black mb-8 dark:text-white tracking-tight flex items-center space-x-3">
                    <FileCheck className="text-primary-600" size={28} />
                    <span>Government Status Log</span>
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="pb-4 px-4 font-black">Project Name</th>
                                <th className="pb-4 px-4 font-black">Current Status</th>
                                <th className="pb-4 px-4 font-black">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                            {projects.map((project) => (
                                <tr key={project.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="py-6 px-4">
                                        <p className="font-extrabold text-slate-800 dark:text-slate-200">{project.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{project.location?.address}</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${project.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {project.status === 'active' ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary-600/20"
                                        >
                                            Update Log
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-black mb-6 dark:text-white uppercase tracking-tight">Upload Official Stamps / Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <FileUpload
                            label="Upload Official Certification"
                            onUploadComplete={(url) => alert(`Official document uploaded at: ${url}`)}
                        />
                        <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Reference Image</p>
                            <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=300" className="w-full h-40 object-cover rounded-2xl grayscale opacity-50" alt="Ref" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="card w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Log Government Status</h3>
                            <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600"><XCircle /></button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Select Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['pending', 'approved', 'denied'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setStatus(s)}
                                            className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${status === s
                                                ? (s === 'approved' ? 'bg-emerald-600 text-white' : s === 'denied' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white')
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {status === 'denied' && (
                                <div className="animate-in slide-in-from-top-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Denial Reason (Mandatory)</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="input-field min-h-[120px] border-rose-200 focus:ring-rose-500"
                                        placeholder="Provide specific details why it was denied..."
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => handleUpdateStatus(selectedProject.id)}
                                className="w-full btn-primary py-4"
                            >
                                Submit Status Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
