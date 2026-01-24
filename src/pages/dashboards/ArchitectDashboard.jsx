import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, FolderKanban, TrendingUp, ChevronRight, PenTool, Image as ImageIcon, Video, Plus, MessageSquare, Loader2 } from 'lucide-react'
import StatCard from '../../components/StatCard'
import ReportGraphs from '../../components/ReportGraphs'
import VideoChatLauncher from '../../components/VideoChatLauncher'
import FileUpload from '../../components/FileUpload'

export default function ArchitectDashboard({ user, stats, projects, tasks, t, getStatusColor }) {
    const navigate = useNavigate()
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [localSketches, setLocalSketches] = useState([])
    const fileInputRef = useRef(null)

    const handleUploadComplete = (url) => {
        const newSketch = {
            id: Date.now(),
            url: url,
            version: (projects[0]?.sketches?.length || 0) + localSketches.length + 1,
            status: 'pending'
        }
        setLocalSketches(prevSketches => [newSketch, ...prevSketches])
    }

    const allSketches = [...localSketches, ...(projects[0]?.sketches || [])]

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('designTasks')} value={tasks.length} icon={PenTool} color="purple" />
                <StatCard title={t('activeProjects')} value={projects.length} icon={FolderKanban} color="primary" />
                <StatCard title={t('completionRate')} value={`${stats?.completionRate || 0}%`} icon={TrendingUp} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sketch Gallery */}
                <div className="lg:col-span-2 card dark:bg-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t('sketchGallery') || 'Sketch Gallery'}</h2>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Upload & Versioning</p>
                        </div>
                        <div className="flex items-center space-x-2">
                        </div>
                    </div>

                    <div className="mb-8">
                        <FileUpload
                            label="Upload New Concept Sketch"
                            onUploadComplete={handleUploadComplete}
                            className="max-w-md"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {allSketches.length > 0 ? allSketches.map((sketch) => (
                            <div key={sketch.id} className="group relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                <img src={sketch.url} alt="Sketch" className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-black text-sm">Version {sketch.version}</p>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${sketch.status === 'approved' ? 'bg-emerald-500' : sketch.status === 'pending' ? 'bg-blue-500' : 'bg-amber-500'} text-white`}>
                                                {sketch.status}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => alert('Previewing Sketch...')}
                                            className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-primary-600 transition-all"
                                        >
                                            <ImageIcon size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : <p className="text-slate-500 text-sm italic">No sketches uploaded yet.</p>}
                    </div>
                </div>

                {/* Communication & Launcher */}
                <div className="space-y-6">
                    <VideoChatLauncher role={user?.role} />

                    <div className="card dark:bg-slate-800">
                        <h3 className="text-lg font-black mb-4 dark:text-white flex items-center space-x-2">
                            <MessageSquare className="text-primary-600" size={20} />
                            <span>Client Feedback</span>
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">"The living room layout looks great, but can we expand the balcony?"</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Salma Al-Hinai</span>
                                    <span className="text-[10px] text-primary-600 font-black">2h ago</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/app/messages')}
                            className="w-full btn-primary py-4 mt-6"
                        >
                            Open Conversations
                        </button>
                    </div>
                </div>
            </div>

            <ReportGraphs user={user} stats={stats} projects={projects} tasks={tasks} />
        </div>
    )
}
