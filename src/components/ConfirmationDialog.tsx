'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ================= TYPES =================
export interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'danger' | 'primary'
  loading?: boolean
}

// ================= ICONS =================
const WarningIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
)

const QuestionIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
)

const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

// ================= COMPONENT =================
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!loading) {
      onClose()
    }
  }

  const getConfirmButtonStyles = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      case 'primary':
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
    }
  }

  const getIconStyles = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'text-red-400'
      case 'primary':
      default:
        return 'text-blue-400'
    }
  }

  const IconComponent = confirmVariant === 'danger' ? WarningIcon : QuestionIcon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
          />
          
          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-gradient-to-b from-slate-900 to-[#1c1c1c] border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4"
            >
              {/* Content */}
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${getIconStyles()}`}>
                    <IconComponent />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>

                {/* Message */}
                {message && (
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {message}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${getConfirmButtonStyles()}`}
                  >
                    {loading && <LoadingSpinner />}
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}