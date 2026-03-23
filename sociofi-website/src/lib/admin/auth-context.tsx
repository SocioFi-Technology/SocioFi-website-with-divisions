'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'division_lead' | 'editor' | 'viewer'
  divisions: string[]
  avatar_url?: string
}

interface AuthContextType {
  user: AdminUser | null
  supabaseUser: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: sbUser } } = await supabase.auth.getUser()
      setSupabaseUser(sbUser)
      if (sbUser) {
        // Try to get admin profile from team_members table; fall back to sensible defaults
        const { data: profile } = await supabase
          .from('team_members')
          .select('*')
          .eq('auth_id', sbUser.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email ?? sbUser.email ?? '',
            name: profile.name ?? sbUser.email?.split('@')[0] ?? 'Admin',
            role: profile.role ?? 'super_admin',
            divisions: profile.divisions ?? ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud'],
            avatar_url: profile.avatar_url,
          })
        } else {
          setUser({
            id: sbUser.id,
            email: sbUser.email ?? '',
            name: sbUser.email?.split('@')[0] ?? 'Admin',
            role: 'super_admin',
            divisions: ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud'],
          })
        }
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null)
      if (!session?.user) {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
