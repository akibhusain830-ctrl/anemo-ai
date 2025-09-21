'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/Toast'
import { formatFileSize, getDocumentStats } from '@/utils/documentUtils'
import { motion } from 'framer-motion'

// ================= ICONS =================
const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const FileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    // Clear previous text when new file is selected
    if (selectedFile !== file) {
      setText('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      addToast({
        type: 'warning',
        title: 'No file selected',
        message: 'Please select a PDF file to upload.'
      })
      return
    }
    
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId || '')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      if (res.ok && data.text) {
        setText(data.text)
        addToast({
          type: 'success',
          title: 'Upload successful!',
          message: `Text extracted from ${file.name} successfully.`
        })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      addToast({
        type: 'error',
        title: 'Upload failed',
        message: error instanceof Error ? error.message : 'Failed to upload and extract text from the PDF.'
      })
    } finally {
      setLoading(false)
    }
  }

  const documentStats = text ? getDocumentStats(text, file?.size) : null

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Upload PDF</h1>
        <p className="text-slate-400">Upload a PDF document to extract text content for your chatbot.</p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-b from-slate-900 to-[#1c1c1c] border border-slate-800 rounded-2xl p-8 mb-8"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
            <UploadIcon />
          </div>
          
          <div className="mb-6">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                Choose a PDF file
              </span>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-slate-400 mt-2">
              Supported format: PDF (max 10MB)
            </p>
          </div>

          {/* File Info */}
          {file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left max-w-md mx-auto"
            >
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  <DocumentIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{file.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <div className="flex items-center gap-1">
                      <FileIcon />
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {loading ? 'Uploading & Extracting...' : 'Upload & Extract Text'}
          </button>
        </div>
      </motion.div>

      {/* Extracted Text */}
      {text && documentStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-b from-slate-900 to-[#1c1c1c] border border-slate-800 rounded-2xl overflow-hidden"
        >
          {/* Header with stats */}
          <div className="border-b border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Extracted Content</h2>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-slate-400">
                  <span className="font-medium text-white">{documentStats.formattedWordCount}</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-medium text-white">{documentStats.formattedFileSize}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="bg-slate-950/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {text}
              </pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
