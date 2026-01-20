import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'
import { useLanguage } from '../context/LanguageContext'
import { ROLES } from '../utils/permissions'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ReportGraphs({ user, stats, projects, tasks }) {
    const { t } = useLanguage()

    const renderAdminGraphs = () => {
        const projectStatusData = [
            { name: 'Active', value: stats?.activeProjects || 0 },
            { name: 'Completed', value: stats?.completedProjects || 0 },
            { name: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length },
            { name: 'Planning', value: projects.filter(p => p.status === 'planning').length },
        ]

        const taskCategoryData = [
            { name: 'Architectural', count: tasks.filter(t => t.category === 'architectural').length },
            { name: 'Civil', count: tasks.filter(t => t.category === 'civil').length },
            { name: 'Electrical', count: tasks.filter(t => t.category === 'electrical').length },
            { name: 'Hydraulic', count: tasks.filter(t => t.category === 'hydraulic').length },
        ]

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Project Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Tasks by Department</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={taskCategoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )
    }

    const renderEngineerGraphs = () => {
        const taskProgressData = [
            { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length },
            { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
            { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
        ]

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">My Task Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={taskProgressData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {taskProgressData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Project Timeline Progress</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projects.map(p => ({ name: p.name, progress: p.progress }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} hide />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="progress" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )
    }

    const renderClientGraphs = () => {
        const progressData = projects.map(p => ({
            name: p.name,
            progress: p.progress,
            status: p.status
        }))

        return (
            <div className="card dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Project Completion Status</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={progressData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.1} />
                            <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={150} />
                            <Tooltip />
                            <Bar dataKey="progress" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('reportOverview')}</h2>
            </div>

            {user?.role === ROLES.ADMIN && renderAdminGraphs()}
            {user?.role === ROLES.CLIENT && renderClientGraphs()}
            {[ROLES.ARCHITECT, ROLES.CIVIL_ENGINEER, ROLES.ELECTRICAL_ENGINEER, ROLES.HYDRAULIC_ENGINEER].includes(user?.role) && renderEngineerGraphs()}
        </div>
    )
}
