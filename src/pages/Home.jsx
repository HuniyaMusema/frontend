import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
    Shield, Target, Eye, LogIn, UserPlus,
    ArrowRight, CheckCircle2, Building2,
    Users, BarChart3, Globe, Sun, Moon
} from 'lucide-react'

export default function Home() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t, language, changeLanguage } = useLanguage()
    const { theme, toggleTheme } = useTheme()

    // Protected redirect: If logged in, go straight to app
    useEffect(() => {
        if (user) {
            navigate('/app/projects')
        }
    }, [user, navigate])

    const handleStart = () => {
        if (user) {
            navigate('/app/projects')
        } else {
            navigate('/login')
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-600/20">
                            T
                        </div>
                        <span className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Takamul</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#about" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('about')}</a>
                        <a href="#vision" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('vision')}</a>
                        <a href="#mission" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t('mission')}</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-all"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button
                            onClick={() => changeLanguage(language === 'en' ? 'am' : 'en')}
                            className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black text-xs uppercase"
                        >
                            {language}
                        </button>
                        {!user ? (
                            <div className="flex items-center space-x-2">
                                <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-700 dark:text-gray-300 px-4 py-2 hover:text-primary-600 transition-colors">
                                    {t('signIn')}
                                </button>
                                <button onClick={() => navigate('/signup')} className="btn-primary py-2 px-6 rounded-xl shadow-lg shadow-primary-600/20">
                                    {t('signUp')}
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => navigate('/app/projects')} className="btn-primary py-2 px-6 rounded-xl">
                                {t('projects')}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-primary-100 dark:border-primary-800">
                        <Building2 size={14} />
                        <span>Master Consulting Construction PLC</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-[1.1] tracking-tight">
                        Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Construction Projects</span> with Takamul
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        The next generation project management system designed for architectural brilliance and engineering precision.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                            onClick={handleStart}
                            className="w-full sm:w-auto px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary-600/40 transform hover:-translate-y-1 transition-all flex items-center justify-center group"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a href="#about" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl font-black text-lg hover:shadow-xl transition-all flex items-center justify-center">
                            Learn More
                        </a>
                    </div>

                    <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6">
                            <p className="text-3xl font-black text-primary-600 mb-1">98%</p>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Efficiency</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-black text-primary-600 mb-1">24/7</p>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Support</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-black text-primary-600 mb-1">100+</p>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Projects</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-black text-primary-600 mb-1">Global</p>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Reach</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="w-20 h-2 bg-primary-600 rounded-full"></div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                {t('aboutSystem')}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                Takamul is a comprehensive project management solution tailored for the construction industry. Developed by <strong>Master Consulting Construction PLC</strong>, it bridges the gap between architects, engineers, clients, and government reviewers.
                            </p>
                            <div className="space-y-4 pt-6">
                                {[
                                    'Real-time document tracking',
                                    'Role-based granular permissions',
                                    'Automated government approval flow',
                                    'Interactive performance analytics'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center rounded-full">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all">
                                <Users className="text-primary-600 mb-4" size={32} />
                                <h3 className="text-xl font-black mb-2 dark:text-white">Collaboration</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Seamless team coordination across all project phases.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 mt-12 transform hover:-translate-y-2 transition-all">
                                <BarChart3 className="text-primary-600 mb-4" size={32} />
                                <h3 className="text-xl font-black mb-2 dark:text-white">Analytics</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Deep insights into project performance and timelines.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div id="vision" className="p-12 bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-bl-[100px] flex items-center justify-center text-primary-600 transition-transform group-hover:scale-110">
                                <Eye size={48} strokeWidth={1} />
                            </div>
                            <h3 className="text-3xl font-black mb-8 dark:text-white flex items-center space-x-4">
                                <span className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                                    <Target size={24} />
                                </span>
                                <span>{t('vision')}</span>
                            </h3>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">
                                "To revolutionize the construction landscape by providing transparent, efficient, and data-driven management tools that empower creators and builders alike."
                            </p>
                        </div>

                        <div id="mission" className="p-12 bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-[100px] flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                                <Shield size={48} strokeWidth={1} />
                            </div>
                            <h3 className="text-3xl font-black mb-8 dark:text-white flex items-center space-x-4">
                                <span className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                    <Globe size={24} />
                                </span>
                                <span>{t('mission')}</span>
                            </h3>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">
                                "Our mission is to deliver excellence through innovative technology, ensuring every blueprint translates into a masterpiece with zero workflow friction."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto bg-primary-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl shadow-primary-600/50">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight relative z-10">
                        Ready to build the future?
                    </h2>
                    <p className="text-primary-100 text-xl mb-12 max-w-xl mx-auto font-medium relative z-10">
                        Join thousands of professionals using Takamul to manage their most ambitious projects.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                        <button onClick={() => navigate('/signup')} className="w-full sm:w-auto px-12 py-5 bg-white text-primary-600 hover:bg-gray-50 rounded-2xl font-black text-lg shadow-2xl transition-all">
                            Create Account
                        </button>
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-12 py-5 bg-primary-700 text-white hover:bg-primary-800 rounded-2xl font-black text-lg transition-all">
                            Login
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-xs mr-2">T</div>
                        <span className="text-xl font-black dark:text-white">Takamul PMS</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-4">
                        A Product of Master Consulting Construction PLC
                    </p>
                    <p className="text-gray-400 text-xs tracking-widest uppercase font-black">
                        © 2026 Takamul. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
