export default function StatCard({ title, value, icon: Icon, color, footer }) {
    const colorClasses = {
        primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400',
        green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
        yellow: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
    }

    return (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value || 0}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.primary}`}>
                    <Icon size={24} />
                </div>
            </div>
            {footer && (
                <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    {footer}
                </div>
            )}
        </div>
    )
}
