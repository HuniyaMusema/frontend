import { useEffect, useState } from 'react'
import { mockAPI } from '../services/mockAPI'
import { Settings as SettingsIcon, Save, Mail } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: '',
    taxRate: 0,
    currency: 'OMR',
    defaultProjectStatus: 'planning',
    emailNotifications: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await mockAPI.getSettings()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await mockAPI.updateSettings(settings)
      setSuccess('Settings saved successfully!')
    } catch (error) {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-premium">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center space-x-3">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/40 rounded-2xl">
              <SettingsIcon className="text-primary-600" size={32} />
            </div>
            <span>System Settings</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">Configure global parameters & preferences</p>
        </div>
      </div>

      <div className="card dark:bg-slate-800">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 rounded-2xl text-sm font-bold flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-600 rounded-2xl text-sm font-bold flex items-center space-x-2">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="input-field"
                placeholder="Takamul PMS"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                className="input-field"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                System Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="input-field"
              >
                <option value="OMR">OMR (Omani Rial)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Default Project Lifecycle Start
              </label>
              <select
                value={settings.defaultProjectStatus}
                onChange={(e) => setSettings({ ...settings, defaultProjectStatus: e.target.value })}
                className="input-field"
              >
                <option value="planning">Initial Planning</option>
                <option value="active">Active Execution</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                <Mail className="text-primary-600" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">Email Notifications</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Receive global system alerts</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-6 h-6 text-primary-600 border-slate-300 rounded-lg focus:ring-primary-500/20 cursor-pointer transition-all"
            />
          </div>

          <div className="flex items-center justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full md:w-auto"
            >
              <Save size={18} />
              <span>{saving ? 'Processing...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

