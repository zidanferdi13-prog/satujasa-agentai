export const applicationRoles = ['super-admin', 'owner', 'admin-user'] as const

export type ApplicationRole = (typeof applicationRoles)[number]

export interface HealthResponse {
  service: 'stnk-jasa-api'
  status: 'ok'
  timestamp: string
}

export interface RolesResponse {
  roles: ApplicationRole[]
}
