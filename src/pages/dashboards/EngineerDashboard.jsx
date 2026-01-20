import { Link } from 'react-router-dom'
import { CheckSquare, FolderKanban, TrendingUp, CheckCircle2, Calendar, ChevronRight, Layers, ExternalLink } from 'lucide-react'
import StatCard from '../../components/StatCard'
import ReportGraphs from '../../components/ReportGraphs'
import VideoChatLauncher from '../../components/VideoChatLauncher'

export default function EngineerDashboard({ user, stats, projects, tasks, t, getStatusColor }) {
    const discipline = user?.role?.split('-')[0] // civil, electrical, hydraulic

    return (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('totalTasks')} value={tasks.length} icon={CheckSquare} color="green" />
                <StatCard title={t('activeProjects')} value={projects.length} icon={FolderKanban} color="primary" />
                <StatCard title={t('disciplineProgress')} value={`${stats?.completionRate}%`} icon={TrendingUp} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card dark:bg-slate-800">
                    <h2 className="text-2xl font-black mb-8 dark:text-white tracking-tight">{t('granularProgressSlider')}</h2>
                    <div className="space-y-8">
                        {projects.map(project => (
                            <div key={project.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{project.name}</h4>
                                    <span className="text-xs font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg uppercase">{discipline} Discipline</span>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <input
                                        type="range"
                                        className="flex-1 accent-primary-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        defaultValue={project.disciplineProgress?.[discipline] || 0}
                                        onChange={(e) => alert(`Updating ${discipline} progress to ${e.target.value}%...`)}
                                    />
                                    <span className="text-lg font-black text-slate-800 dark:text-white w-12">{project.disciplineProgress?.[discipline] || 0}%</span>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => alert(`Launching Technical Drawing Viewer for ${project.name}...`)}
                                        className="flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase hover:underline"
                                    >
                                        <Layers size={16} />
                                        <span>Technical Drawing Viewer</span>
                                    </button>
                                    <Link to={`/app/projects/${project.id}`} className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:scale-110 transition-transform">
                                        <ExternalLink size={18} className="text-slate-400 hover:text-primary-600" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <VideoChatLauncher role={user?.role} />

                    <div className="card dark:bg-slate-800 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                        <h3 className="text-lg font-black mb-6 flex items-center space-x-2">
                            <CheckCircle2 size={20} />
                            <span>Profile Editing</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 mb-8">
                                <img src={user?.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" alt="Engineer" />
                                <div>
                                    <p className="font-black">{user?.name}</p>
                                    <p className="text-xs text-white/70 uppercase tracking-widest font-bold font-display">{user?.role}</p>
                                </div>
                            </div>
                            <Link to="/app/profile" className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-center block font-black uppercase tracking-widest text-[10px] transition-all border border-white/10">
                                Update Availability
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <ReportGraphs user={user} stats={stats} projects={projects} tasks={tasks} />
        </div>
    )
}
