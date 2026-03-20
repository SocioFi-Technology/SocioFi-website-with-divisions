'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TeamMember, Division, Role } from '@/lib/supabase/types';
import { canDo } from '@/lib/admin/permissions';

interface AdminContextType {
  user: TeamMember | null;
  loading: boolean;
  can: (action: string, division?: Division) => boolean;
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  loading: true,
  can: () => false,
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const { data } = await supabase
          .from('team_members')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();
        setUser(data);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const can = (action: string, division?: Division): boolean => {
    if (!user) return false;
    return canDo(user.role as Role, action, division, user.divisions as Division[]);
  };

  return (
    <AdminContext.Provider value={{ user, loading, can }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
