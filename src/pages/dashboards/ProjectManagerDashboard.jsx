import { Link, useNavigate } from 'react-router-dom'
import { FolderKanban, ListTodo, Users, TrendingUp, ChevronRight, BrainCircuit, Zap, ShieldCheck } from 'lucide-react'
import StatCard from '../../components/StatCard'
import ReportGraphs from '../../components/ReportGraphs'
import VideoChatLauncher from '../../components/VideoChatLauncher'

export default function ProjectManagerDashboard({ user, stats, projects, tasks, t, getStatusColor }) {
    const navigate = useNavigate()
    const suggestions = [
        { title: 'Assign Civil Engineer', desc: 'Sketch approved for Villa project. Next step: Foundation planning.', action: 'Assign Now', link: '/app/tasks' },
        { title: 'Verify Pre-payment', desc: 'Commercial Complex is pending payment verification.', action: 'Verify', link: '/app/projects' }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title={t('totalProjects')} value={stats?.totalProjects || 0} icon={FolderKanban} color="primary" />
                <StatCard title={t('activeTasks')} value={stats?.activeTasks || 0} icon={ListTodo} color="blue" />
                <StatCard title={t('teamMembers')} value={stats?.totalUsers || 0} icon={Users} color="purple" />
                <StatCard title={t('pendingPayments')} value={stats?.pendingPayments || 0} icon={TrendingUp} color="yellow" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Next Steps AI */}
                <div className="lg:col-span-2 card dark:bg-slate-800 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50/50 via-white to-white dark:from-primary-900/10 dark:via-slate-800 dark:to-slate-800">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-600/30">
                            <BrainCircuit size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">AI Master Advisor</h2>
                            <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest mt-0.5">Next-Steps Suggestions</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-300 transition-all group overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full group-hover:scale-[3] transition-transform duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 text-primary-600 font-black text-xs uppercase tracking-widest mb-2">
                                        <Zap size={14} />
                                        <span>Smart Recommendation</span>
                                    </div>
                                    <h4 className="font-extrabold text-slate-800 dark:text-white mb-2">{s.title}</h4>
                                    <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">{s.desc}</p>
                                    <button
                                        onClick={() => navigate(s.link)}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/40 px-4 py-2 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-all"
                                    >
                                        {s.action}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Config */}
                <div className="space-y-6">
                    <VideoChatLauncher role={user?.role} />

                    <div className="card dark:bg-slate-800">
                        <h3 className="text-lg font-black mb-6 dark:text-white flex items-center space-x-2">
                            <ShieldCheck className="text-primary-600" size={20} />
                            <span>Project Management Center</span>
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Assign Tech Staff', path: '/app/team' },
                                { name: 'Confirm Payments', path: '/app/projects' },
                                { name: 'Monitor Deadlines', path: '/app/tasks' },
                                { name: 'Assign Messenger', path: '/app/projects' }
                            ].map(item => (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.path)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-600"
                                >
                                    <span className="text-sm font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{item.name}</span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ReportGraphs user={user} stats={stats} projects={projects} tasks={tasks} />
        </div>
    )
}
