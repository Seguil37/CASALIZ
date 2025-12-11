export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  ADMIN: 'admin',
  CLIENT: 'client',
};

export const roleLabels = {
  [ROLES.MASTER_ADMIN]: 'Master',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.CLIENT]: 'Cliente',
};

export const isAdminRole = (role) => [ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(role);
