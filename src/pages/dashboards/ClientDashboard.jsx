import { Link } from 'react-router-dom'
import { FolderKanban, TrendingUp, CheckCircle2, ChevronRight, Image, CreditCard, UploadCloud, CheckCircle, XCircle } from 'lucide-react'
import StatCard from '../../components/StatCard'
import ReportGraphs from '../../components/ReportGraphs'
import VideoChatLauncher from '../../components/VideoChatLauncher'
import { useState } from 'react'
import { mockAPI } from '../../services/mockAPI'
import { useAuth } from '../../context/AuthContext'

export default function ClientDashboard({ user, stats, projects, tasks, t, getStatusColor }) {
    const [activeTab, setActiveTab] = useState('progress')
    const { user: currentUser } = useAuth()

    const handleApproveSketch = async (projectId) => {
        try {
            await mockAPI.updateProject(projectId, {
                sketchApproved: true,
                progress: 50 // Increase progress slightly after approval
            })
            alert('Sketch approved! The project will now proceed to the next stage.')
            window.location.reload()
        } catch (error) {
            console.error('Error approving sketch:', error)
            alert('Failed to approve sketch')
        }
    }

    const handleRejectSketch = async (projectId) => {
        const comment = prompt('Please provide feedback for the rejection:')
        if (comment === null) return // User cancelled

        try {
            await mockAPI.updateProject(projectId, {
                sketchApproved: false
            })
            // Here we would also send a message to the architect, but for mock purposes:
            alert('Sketch rejected. Feedback has been recorded.')
            window.location.reload()
        } catch (error) {
            console.error('Error rejecting sketch:', error)
            alert('Failed to reject sketch')
        }
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('totalProjects')} value={projects.length} icon={FolderKanban} color="primary" />
                <StatCard title={t('activeProjects')} value={projects.filter(p => p.status === 'active').length} icon={TrendingUp} color="blue" />
                <StatCard title={t('completionRate')} value={`${stats?.completionRate || 0}%`} icon={CheckCircle2} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Content Area with Tabs */}
                    <div className="card dark:bg-slate-800">
                        <div className="flex space-x-6 mb-8 border-b border-slate-100 dark:border-slate-700">
                            {['progress', 'approvals', 'payments'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-400'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'progress' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                {projects.map(project => (
                                    <div key={project.id} className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{project.name}</h4>
                                            <span className="text-[10px] font-black text-primary-600 bg-primary-100 px-3 py-1 rounded-full uppercase">Only Progress Visible</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
                                            <div className="bg-primary-600 h-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                            <span className="text-sm font-black text-slate-800 dark:text-white">{project.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'approvals' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h3 className="text-lg font-black dark:text-white flex items-center space-x-2">
                                    <Image className="text-primary-600" size={20} />
                                    <span>Sketch Approval Logic</span>
                                </h3>
                                {projects.filter(p => p.sketches?.length > 0).map(project => (
                                    <div key={project.id} className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="font-extrabold mb-4 uppercase text-xs tracking-widest text-slate-500">{project.name} - Latest Design</p>
                                        <img src={project.sketches[0].url} className="w-full h-64 object-cover rounded-2xl mb-6 shadow-xl" alt="Design" />
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleApproveSketch(project.id)}
                                                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                                            >
                                                <CheckCircle size={16} />
                                                <span>Approve Design</span>
                                            </button>
                                            <button
                                                onClick={() => handleRejectSketch(project.id)}
                                                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                                            >
                                                <XCircle size={16} />
                                                <span>Reject & Comment</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="p-8 bg-primary-50 dark:bg-primary-900/20 rounded-3xl border border-primary-100 dark:border-primary-800/50">
                                    <h3 className="text-lg font-black dark:text-white mb-2 flex items-center space-x-2">
                                        <CreditCard className="text-primary-600" size={20} />
                                        <span>Payment tracking</span>
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-6 font-medium">Upload your receipts or invoices to verify payments.</p>
                                    <div
                                        onClick={() => alert('Opening File Uploader for Receipts...')}
                                        className="border-2 border-dashed border-primary-200 dark:border-primary-800 rounded-3xl p-10 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all group cursor-pointer"
                                    >
                                        <UploadCloud size={48} className="text-primary-400 group-hover:scale-110 group-hover:text-primary-600 transition-all" />
                                        <p className="mt-4 font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">Drop Invoices / Receipts</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <VideoChatLauncher role={user?.role} />

                    <div className="card dark:bg-slate-800 border-l-4 border-l-blue-500">
                        <h3 className="text-lg font-black mb-4 dark:text-white tracking-tight">AI Status Advisor</h3>
                        <p className="text-sm text-slate-500 font-medium mb-4 italic">"Based on your current progress, your project is 5 days ahead of schedule. We recommend reviewing the interior sketches soon to maintain momentum."</p>
                        <button
                            onClick={() => alert('Opening AI suggestion details...')}
                            className="text-primary-600 font-black uppercase tracking-widest text-[10px] hover:underline flex items-center space-x-1"
                        >
                            <span>See more suggestions</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <ReportGraphs user={user} stats={stats} projects={projects} tasks={tasks} />
        </div>
    )
}
