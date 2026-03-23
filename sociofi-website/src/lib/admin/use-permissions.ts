import { useAuth } from './auth-context'

export function usePermissions() {
  const { user } = useAuth()

  const can = (action: string, division?: string): boolean => {
    if (!user) return false
    const role: string = user.role
    if (role === 'super_admin') return true
    if (action === 'read') return !division || user.divisions.includes(division)
    if (action === 'write') return role !== 'viewer' && (!division || user.divisions.includes(division))
    if (action === 'assign') return role === 'division_lead'
    if (action === 'delete') return role === 'super_admin'
    return false
  }

  return { can, user }
}
