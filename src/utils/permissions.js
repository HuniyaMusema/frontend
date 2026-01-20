// Role definitions and permissions
export const ROLES = {
  ADMIN: 'admin', // System Admin
  PROJECT_MANAGER: 'project-manager',
  ARCHITECT: 'architect',
  CIVIL_ENGINEER: 'civil-engineer',
  ELECTRICAL_ENGINEER: 'electrical-engineer',
  HYDRAULIC_ENGINEER: 'hydraulic-engineer',
  CLIENT: 'client',
  MESSENGER: 'messenger',
}

// Permission checks
export const hasPermission = (userRole, permission) => {
  const permissions = {
    [ROLES.ADMIN]: [
      'view-all-projects',
      'view-analytics',
      'manage-users',
      'edit-profile',
      'view-settings',
    ],
    [ROLES.PROJECT_MANAGER]: [
      'view-assigned-projects',
      'create-project',
      'edit-project',
      'manage-assigned-projects',
      'confirm-payments',
      'monitor-deadlines',
      'assign-messenger',
      'assign-tech-staff',
      'view-tasks',
      'create-task',
      'edit-any-task',
      'view-team',
      'edit-profile',
      'send-message-client',
      'view-all-tasks',
    ],
    [ROLES.ARCHITECT]: [
      'view-assigned-projects',
      'edit-assigned-projects',
      'view-tasks',
      'create-task',
      'edit-assigned-tasks',
      'view-team',
      'edit-profile',
      'send-message-client',
    ],
    [ROLES.CIVIL_ENGINEER]: [
      'view-assigned-projects',
      'view-civil-tasks',
      'edit-civil-tasks',
      'edit-profile',
    ],
    [ROLES.ELECTRICAL_ENGINEER]: [
      'view-assigned-projects',
      'view-electrical-tasks',
      'edit-electrical-tasks',
      'edit-profile',
    ],
    [ROLES.HYDRAULIC_ENGINEER]: [
      'view-assigned-projects',
      'view-hydraulic-tasks',
      'edit-hydraulic-tasks',
      'edit-profile',
    ],
    [ROLES.CLIENT]: [
      'view-projects',
      'view-progress-percentage',
      'send-message-architect',
      'view-payments',
      'make-payment',
      'edit-profile',
    ],
    [ROLES.MESSENGER]: [
      'view-government-approvals',
      'update-approval-status',
      'edit-profile',
    ],
  }

  return permissions[userRole]?.includes(permission) || false
}

export const canViewProject = (userRole, project) => {
  if (hasPermission(userRole, 'view-all-projects')) return true
  if (userRole === ROLES.CLIENT) return true
  if (hasPermission(userRole, 'view-assigned-projects')) {
    return project.teamMembers?.includes(userRole) || project.managerId === userRole
  }
  return false
}

export const canEditTask = (userRole, task) => {
  if (hasPermission(userRole, 'edit-any-task')) return true

  // Engineers can only edit their specific technical tasks
  if (userRole === ROLES.CIVIL_ENGINEER && task.category === 'civil') return true
  if (userRole === ROLES.ELECTRICAL_ENGINEER && task.category === 'electrical') return true
  if (userRole === ROLES.HYDRAULIC_ENGINEER && task.category === 'hydraulic') return true

  // Architects can edit assigned tasks
  if (userRole === ROLES.ARCHITECT && hasPermission(userRole, 'edit-assigned-tasks')) {
    return true
  }

  return false
}

