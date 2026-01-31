export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  ADMIN: 'admin',
  OPERATOR: 'operator',
  CLIENT: 'client',
};

export const roleLabels = {
  [ROLES.MASTER_ADMIN]: 'Master',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.OPERATOR]: 'Operativo',
  [ROLES.CLIENT]: 'Cliente',
};

export const isAdminRole = (role) => [ROLES.MASTER_ADMIN, ROLES.ADMIN].includes(role);

export const isStaff = (role) => [ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR].includes(role);
