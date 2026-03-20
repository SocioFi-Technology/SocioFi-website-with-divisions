import { Role, Division } from '@/lib/supabase/types';

type Action = 'read' | 'write' | 'delete' | 'assign' | 'manage_team' | 'manage_settings' | 'publish';

export const PERMISSIONS: Record<Role, { divisions: '*' | 'assigned'; actions: Action[] }> = {
  super_admin: {
    divisions: '*',
    actions: ['read', 'write', 'delete', 'assign', 'manage_team', 'manage_settings', 'publish'],
  },
  division_lead: {
    divisions: 'assigned',
    actions: ['read', 'write', 'assign', 'publish'],
  },
  editor: {
    divisions: 'assigned',
    actions: ['read', 'write'],
  },
  viewer: {
    divisions: 'assigned',
    actions: ['read'],
  },
} as const;

export function canDo(
  role: Role,
  action: string,
  division?: Division,
  userDivisions?: Division[]
): boolean {
  const perms = PERMISSIONS[role];
  if (!perms.actions.includes(action as Action)) return false;
  if (perms.divisions === '*') return true;
  if (!division) return true;
  return userDivisions?.includes(division) ?? false;
}
