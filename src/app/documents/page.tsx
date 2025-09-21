'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/Toast'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import { getDocumentStats, getTextPreview } from '@/utils/documentUtils'

// ================= TYPES =================
interface Document {
  id: string
  title: string
  content: string
  fileSize: number
  createdAt: string
  updatedAt: string
}

// ================= ICONS =================
const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

// ================= COMPONENTS =================
const DocumentCard: React.FC<{
  document: Document
  onEdit: (doc: Document) => void
  onDelete: (doc: Document) => void
  index: number
}> = ({ document, onEdit, onDelete, index }) => {
  const stats = getDocumentStats(document.content, document.fileSize)
  const preview = getTextPreview(document.content, 120)
  const updatedDate = new Date(document.updatedAt).toLocaleDateString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-to-b from-slate-900 to-[#1c1c1c] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-blue-400">
            <DocumentIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate">{document.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
              <div className="flex items-center gap-1">
                <CalendarIcon />
                <span>Updated {updatedDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(document)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
            title="Edit document"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(document)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Delete document"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      {/* Content preview */}
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        {preview}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            <span className="font-medium text-white">{stats.formattedWordCount}</span>
          </span>
          <span className="text-slate-400">
            <span className="font-medium text-white">{stats.formattedFileSize}</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ================= MAIN COMPONENT =================
export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    document: Document | null
    loading: boolean
  }>({
    isOpen: false,
    document: null,
    loading: false
  })
  
  const { addToast } = useToast()

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      
      if (response.ok) {
        setDocuments(data.documents || [])
      } else {
        throw new Error(data.error || 'Failed to fetch documents')
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      addToast({
        type: 'error',
        title: 'Failed to load documents',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleEdit = (document: Document) => {
    // In a real app, this would open an edit dialog or navigate to an edit page
    addToast({
      type: 'info',
      title: 'Edit functionality',
      message: `Edit functionality for "${document.title}" would be implemented here.`
    })
  }

  const handleDeleteClick = (document: Document) => {
    setDeleteDialog({
      isOpen: true,
      document,
      loading: false
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.document) return

    setDeleteDialog(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch(`/api/documents?id=${deleteDialog.document.id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== deleteDialog.document?.id))
        addToast({
          type: 'success',
          title: 'Document deleted',
          message: `"${deleteDialog.document.title}" has been successfully deleted.`
        })
        setDeleteDialog({ isOpen: false, document: null, loading: false })
      } else {
        throw new Error(data.error || 'Failed to delete document')
      }
    } catch (error) {
      console.error('Failed to delete document:', error)
      addToast({
        type: 'error',
        title: 'Delete failed',
        message: error instanceof Error ? error.message : 'Failed to delete the document'
      })
      setDeleteDialog(prev => ({ ...prev, loading: false }))
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, document: null, loading: false })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3 mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-slate-700 rounded w-20"></div>
                  <div className="h-4 bg-slate-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Documents</h1>
          <p className="text-slate-400">Manage your document library and knowledge base.</p>
        </div>
        <button
          onClick={() => addToast({
            type: 'info',
            title: 'Create document',
            message: 'Create new document functionality would be implemented here.'
          })}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <PlusIcon />
          New Document
        </button>
      </motion.div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document, index) => (
            <DocumentCard
              key={document.id}
              document={document}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="text-slate-500 mb-4">
            <DocumentIcon />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No documents found</h3>
          <p className="text-slate-400 mb-6">Get started by uploading your first document.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Upload Document
          </button>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteDialog.document?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteDialog.loading}
      />
    </div>
  )
}