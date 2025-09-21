'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ToastProvider } from '@/components/Toast'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        window.location.reload()
      }
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
