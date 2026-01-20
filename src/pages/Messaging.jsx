import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { mockAPI } from '../services/mockAPI'
import { Send, Search, User, Check, CheckCheck, Paperclip, MoreVertical, MessageSquare, Sparkles } from 'lucide-react'

export default function Messaging() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id)
    }
  }, [selectedConv])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      if (!user?.id) return
      const data = await mockAPI.getConversations(user.id)
      setConversations(data)
      if (data.length > 0 && !selectedConv) {
        setSelectedConv(data[0])
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (convId) => {
    try {
      const data = await mockAPI.getMessages(convId)
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv) return

    try {
      const msg = await mockAPI.sendMessage({
        conversationId: selectedConv.id,
        senderId: user.id,
        text: newMessage,
      })
      setMessages([...messages, msg])
      setNewMessage('')

      // Update last message in conversation list
      setConversations(conversations.map(c =>
        c.id === selectedConv.id ? { ...c, lastMessage: newMessage, updatedAt: new Date().toISOString() } : c
      ))
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const filteredConversations = conversations.filter(c =>
    c.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex overflow-hidden card p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full md:w-80 flex flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('messages')}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search')}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 ${selectedConv?.id === conv.id ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-600' : ''
                }`}
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
                <User size={24} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{conv.participantName}</h3>
                  <span className="text-xs text-gray-500">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
        {selectedConv ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{selectedConv.participantName}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online Now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert("AI SUMMARY: The technical discussion revolves around structural load-bearing capacity. Recommendation: Proceed with 20mm rebar.")}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                >
                  <Sparkles size={14} />
                  <span>AI Summarize</span>
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <MoreVertical size={20} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
              {messages.map((msg) => {
                const isMe = msg.senderId === user.id
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                      }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                        <span className="text-[10px]">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={handleSend} className="flex items-center space-x-3">
                <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 flex-1 px-4 py-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 dark:bg-gray-900/20">
            <MessageSquare size={64} className="mb-4 text-gray-300 dark:text-gray-700" />
            <p className="text-lg font-medium">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
