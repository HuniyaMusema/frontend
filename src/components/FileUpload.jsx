import { useState, useRef } from 'react'
import { UploadCloud, CheckCircle2, XCircle, Loader2, FileText, Image as ImageIcon } from 'lucide-react'

export default function FileUpload({
    onUploadComplete,
    label = 'Upload File',
    accept = 'image/*',
    maxSize = 10,
    className = ""
}) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [fileName, setFileName] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef(null)

    const handleFile = (file) => {
        if (!file) return

        // Validate size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File too large. Maximum size is ${maxSize}MB.`)
            return
        }

        setError('')
        setFileName(file.name)
        setUploading(true)
        setProgress(0)
        setSuccess(false)

        // Simulate upload
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => {
                        setUploading(false)
                        setSuccess(true)
                        if (onUploadComplete) {
                            // In a real app, we'd pass the URL from the server
                            onUploadComplete(URL.createObjectURL(file))
                        }
                    }, 500)
                    return 100
                }
                return prev + 10
            })
        }, 150)
    }

    const onDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }

    return (
        <div className={`w-full ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
                accept={accept}
            />

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-[2rem] p-8 transition-all cursor-pointer
                    flex flex-col items-center justify-center space-y-4
                    ${uploading ? 'bg-slate-50 dark:bg-slate-800/50 border-primary-300' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800'}
                    ${success ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : ''}
                    ${error ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10' : ''}
                `}
            >
                {uploading ? (
                    <>
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 animate-pulse">
                            <Loader2 size={32} className="animate-spin" />
                        </div>
                        <div className="w-full max-w-xs">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-primary-100 dark:bg-primary-900/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </>
                ) : success ? (
                    <>
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Upload Successful</p>
                            <p className="text-xs text-slate-500 font-bold mt-1 line-clamp-1">{fileName}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setSuccess(false)
                                setFileName('')
                            }}
                            className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                        >
                            Upload Another
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                            <UploadCloud size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{label}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">PNG, JPG or PDF up to {maxSize}MB</p>
                        </div>
                    </>
                )}

                {error && (
                    <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-center space-x-2 text-rose-600">
                        <XCircle size={14} />
                        <span className="text-xs font-bold">{error}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
