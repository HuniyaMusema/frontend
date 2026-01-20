import { Video, User, Shield, HardHat } from 'lucide-react'
import { useState } from 'react'

export default function VideoChatLauncher({ role }) {
    const [targetRole, setTargetRole] = useState('')

    const handleStartCall = () => {
        if (!targetRole) {
            alert('Please select who you would like to call.')
            return
        }
        alert(`Starting secure video call with ${targetRole}...\nConnecting as ${role.toUpperCase()}...`)
    }

    const roles = [
        { id: 'admin', label: 'Project Manager', icon: Shield },
        { id: 'architect', label: 'Lead Architect', icon: User },
        { id: 'engineer', label: 'Technical Engineer', icon: HardHat },
    ]

    return (
        <div className="card dark:bg-slate-800 border-l-4 border-l-primary-600 animate-in fade-in zoom-in duration-500">
            <h3 className="text-lg font-black mb-4 dark:text-white flex items-center space-x-2">
                <Video className="text-primary-600" size={20} />
                <span>Secure Video Hub</span>
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Schedule or start an instant secure meeting with your project team and clients.
            </p>

            <div className="space-y-3 mb-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select call target:</p>
                <div className="grid grid-cols-1 gap-2">
                    {roles.map((r) => {
                        const Icon = r.icon
                        return (
                            <button
                                key={r.id}
                                onClick={() => setTargetRole(r.label)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl border transition-all ${targetRole === r.label
                                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10 text-primary-600'
                                    : 'border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="text-xs font-bold">{r.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <button
                onClick={handleStartCall}
                className="w-full btn-primary flex items-center justify-center space-x-3 py-4 shadow-lg shadow-primary-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                <Video size={18} />
                <span className="font-black uppercase tracking-widest text-[10px]">Start Call Now</span>
            </button>
        </div>
    )
}
