import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = "super_admin" | "admin" | "synode_manager";

interface RolePermissions {
  canManageUsers: boolean;
  canManageRoles: boolean;
  canViewAllReports: boolean;
  canManagePresence: boolean;
  canViewSynodeReports: boolean;
}

const rolePermissionsMap: Record<UserRole, RolePermissions> = {
  super_admin: {
    canManageUsers: true,
    canManageRoles: true,
    canViewAllReports: true,
    canManagePresence: true,
    canViewSynodeReports: true,
  },
  admin: {
    canManageUsers: false,
    canManageRoles: false,
    canViewAllReports: true,
    canManagePresence: true,
    canViewSynodeReports: true,
  },
  synode_manager: {
    canManageUsers: false,
    canManageRoles: false,
    canViewAllReports: false,
    canManagePresence: false,
    canViewSynodeReports: true,
  },
};

export const useRolePermissions = () => {
  const { toast } = useToast();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les permissions",
        });
        throw error;
      }

      return profile.role as UserRole;
    },
  });

  const permissions = userRole ? rolePermissionsMap[userRole] : null;

  return {
    role: userRole,
    isLoading,
    permissions,
  };
};