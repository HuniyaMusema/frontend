import { Link, useNavigate } from 'react-router-dom'
import { FolderKanban, ListTodo, Users, TrendingUp, ChevronRight, BrainCircuit, Activity, ShieldCheck, Mail, Bell, Settings, Zap, MessageSquare } from 'lucide-react'
import StatCard from '../../components/StatCard'
import ReportGraphs from '../../components/ReportGraphs'
import FileUpload from '../../components/FileUpload'
import { useState } from 'react'

export default function AdminDashboard({ user, stats, projects, tasks, t, getStatusColor }) {
    const navigate = useNavigate()

    // Admin specific quick stats/notifications
    const systemAlerts = [
        { type: 'user', title: 'New User Registration', desc: 'A new client has registered and needs verification.', time: '2h ago' },
        { type: 'perf', title: 'System Performance', desc: 'All modules are operating normally. 99.9% uptime.', time: '5h ago' }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* System Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="System Users" value={stats?.totalTeamMembers || 0} icon={Users} color="primary" />
                <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon={FolderKanban} color="blue" />
                <StatCard title="System Analytics" value="Active" icon={Activity} color="purple" />
                <StatCard title="Security Status" value="Healthy" icon={ShieldCheck} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User & System Management */}
                <div className="lg:col-span-2 card dark:bg-slate-800 border-l-4 border-primary-600">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-primary-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">System Administration</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Control Center</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/app/team')}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary-600/20"
                        >
                            Manage All Users
                        </button>
                    </div>

                    <div className="space-y-4">
                        {systemAlerts.map((alert, i) => (
                            <div key={i} className="flex items-start space-x-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                <div className={`p-2 rounded-lg ${alert.type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {alert.type === 'user' ? <Bell size={18} /> : <Activity size={18} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">{alert.title}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold">{alert.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{alert.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Administrative Fast Actions */}
                <div className="card dark:bg-slate-800">
                    <h3 className="text-lg font-black mb-6 dark:text-white flex items-center space-x-2">
                        <Zap size={20} className="text-primary-600" />
                        <span>Admin Fast Actions</span>
                    </h3>
                    <div className="space-y-3">
                        {[
                            { name: 'System Settings', path: '/app/settings', icon: Settings },
                            { name: 'Audit Global Logs', path: '/app/analytics', icon: Activity },
                            { name: 'Backup Data', path: '/app/settings', icon: ShieldCheck },
                            { name: 'Open Messaging', path: '/app/messages', icon: MessageSquare },
                            { name: 'Send Broadcast', path: '/app/messages', icon: Mail }
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center justify-between p-4 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-2xl transition-all group border border-transparent hover:border-primary-100 dark:hover:border-primary-900/30"
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon size={18} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                                    <span className="text-sm font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{item.name}</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Global Report Graphs */}
            <ReportGraphs user={user} stats={stats} projects={projects} tasks={tasks} />

            {/* Admin Upload Section */}
            <div className="card dark:bg-slate-800 border-t-4 border-t-primary-600 mt-8">
                <h3 className="text-xl font-black mb-6 dark:text-white uppercase tracking-tight">System Data & Reports Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <FileUpload
                        label="Upload System Audit / Backup"
                        onUploadComplete={(url) => alert(`Audit file uploaded: ${url}`)}
                        accept=".pdf,.zip,.json"
                    />
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                        Administrators can use this module to upload sensitive system logs, manual backups, or compliance certificates directly to the master server.
                    </p>
                </div>
            </div>
        </div>
    )
}
