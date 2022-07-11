import { useAuth } from "../context/AuthContext";
import { validateUserPermission } from "../utils/validateUserPermission";

interface useCanParams {
  permissions?: string[];
  roles?: string[];
}

export const useCan = ({ permissions, roles }: useCanParams) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermission({
    user,
    permissions,
    roles
  });

  return userHasValidPermissions;
}
