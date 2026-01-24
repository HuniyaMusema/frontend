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
        <div className="card dark:bg-slate-800 animate-premium">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-white mt-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        {value || 0}
                    </p>
                </div>
                <div className={`p-4 rounded-2xl shadow-sm ${colorClasses[color] || colorClasses.primary}`}>
                    <Icon size={24} />
                </div>
            </div>
            {footer && (
                <div className="mt-6 flex items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-t border-slate-50 dark:border-slate-700/50 pt-4">
                    {footer}
                </div>
            )}
        </div>
    )
}
