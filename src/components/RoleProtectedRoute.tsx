import { Navigate, useLocation } from "react-router-dom";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { Loader2 } from "lucide-react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof ReturnType<typeof useRolePermissions>["permissions"];
}

const RoleProtectedRoute = ({ children, requiredPermission }: RoleProtectedRouteProps) => {
  const { permissions, isLoading } = useRolePermissions();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!permissions) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !permissions[requiredPermission]) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;