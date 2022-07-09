import { useAuth } from "../context/AuthContext";

interface useCanParams {
  permissions?: string[];
  roles?: string[];
}

export const useCan = ({ permissions, roles }: useCanParams) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every(permission => user.permissions.includes(permission));

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some(role => user.roles.includes(role));

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
