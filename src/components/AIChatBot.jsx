import { useState, useRef, useEffect } from 'react'
import { Send, Bot, X, MessageSquare, User, Sparkles, Zap, TrendingUp } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function AIChatBot() {
    const { t } = useLanguage()
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem(`takamul_chat_${user?.id}`)
        return savedMessages ? JSON.parse(savedMessages) : [
            { id: 1, text: `Hello ${user?.name || ''}! I'm your Takamul AI Assistant. How can I help you with your projects today?`, sender: 'bot' }
        ]
    })
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(`takamul_chat_${user.id}`, JSON.stringify(messages))
        }
        scrollToBottom()
    }, [messages, isTyping, user?.id])

    const handleSend = async (e, forcedText = null) => {
        if (e) e.preventDefault()
        const textToUse = forcedText || input
        if (!textToUse.trim()) return

        const userMessage = { id: Date.now(), text: textToUse, sender: 'user' }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        // Simulate AI response with Master Requirements logic
        setTimeout(() => {
            let responseText = ""
            const lowerInput = textToUse.toLowerCase()

            if (lowerInput.includes('summarize') || lowerInput.includes('technical')) {
                if (user?.role === 'client') {
                    responseText = "CLIENT SUMMARY: Your 'Residential Building' project is currently in the architectural approval phase. The architect has addressed your feedback on the balcony layout. You can now review and approve the updated sketch in your dashboard."
                } else if (user?.role === 'messenger') {
                    responseText = "GOVERNMENT LOG SUMMARY: There are 2 pending architectural approvals that need status updates. 'Commercial Complex' is currently flagged as 'Pending' in the municipal system."
                } else {
                    responseText = "TECHNICAL ANALYSIS: The discussion between the Civil Engineer and Architect regarding the 'Residential Building' foundation has been summarized. Key takeaway: Reinforcement density needs to increase by 15% due to soil moisture. No structural changes to architectural layout required."
                }
            } else if (lowerInput.includes('next') || lowerInput.includes('steps')) {
                if (user?.role === 'admin') {
                    responseText = "MANAGER NEXT STEPS: 1. Assign Hydraulic Engineer to 'Residential Building'. 2. Verify Client Pre-payment for 'Commercial Complex'. 3. Review Messenger status log for pending government approvals."
                } else if (user?.role === 'client') {
                    responseText = "YOUR NEXT STEPS: 1. Review the new sketches for 'Residential Building'. 2. Check the status of your recent payment for 'Commercial Complex'."
                } else {
                    responseText = `AS ${user?.role.toUpperCase()}: 1. Review assigned tasks in the Tasks page. 2. Submit technical progress updates for your projects.`
                }
            } else if (lowerInput.includes('status') || lowerInput.includes('project')) {
                responseText = `As ${user?.role === 'admin' ? 'Project Manager' : user?.role}, you are overseeing ${user?.role === 'admin' ? 'all' : 'your assigned'} projects. Residential Building is 45% complete and on schedule.`
            } else {
                responseText = `I am your Takamul AI Assistant. I can help you summarize technical discussions or suggest next steps for your projects. What would you like to explore today?`
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }])
            setIsTyping(false)
        }, 1500)
    }

    const quickActions = [
        { label: 'Summarize Technical Chat', icon: MessageSquare, action: () => handleSend(null, "Summarize the technical discussion") },
        { label: 'Suggest Next Steps', icon: TrendingUp, action: () => handleSend(null, "What are the next steps for my projects?") },
    ]

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 group"
                >
                    <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-500"></span>
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 md:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-primary-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{t('aiAssistant')}</h3>
                                <div className="flex items-center text-[10px] text-primary-100">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    Online Now
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-2 flex space-x-2 bg-slate-100/50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
                        {quickActions.map((qa, i) => (
                            <button
                                key={i}
                                onClick={qa.action}
                                className="whitespace-nowrap flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-600 hover:scale-105 transition-all shadow-sm"
                            >
                                <Zap size={10} />
                                <span>{qa.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-2`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('askMeAnything')}
                                className="w-full bg-gray-100 dark:bg-gray-700 text-sm py-3 pl-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 transition-colors"
                                disabled={!input.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
