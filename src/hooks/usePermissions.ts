
import { useMemo } from 'react';
import { UserRole } from '@/types/types';

export const useCanManage = (itemOwnerId: string | number, currentUserId: string | number, userRole: UserRole) => {
  return useMemo(() => {
    // 1. Check for Admin or system-level roles (Force uppercase to avoid casing bugs)
    const isAdmin = userRole?.toUpperCase() === UserRole.ADMIN.toUpperCase() || userRole?.toUpperCase() === UserRole.SYSTEM_ADMIN_LIVE.toUpperCase();
    
    // 2. Check for Ownership (Force both to strings to avoid type mismatch, e.g., 1 === "1")
    const isOwner = String(itemOwnerId) === String(currentUserId);
    
    return isAdmin || isOwner;
  }, [itemOwnerId, currentUserId, userRole]);
};
