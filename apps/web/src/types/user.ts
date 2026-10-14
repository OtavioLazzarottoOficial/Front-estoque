export enum Roles {
  ADMIN = "ADMIN",
  WAREHOUSE = "WAREHOUSE",
  USER = "USER",
}

export type UserProps = {
  id: string
  name: string
  email: string
  password: string
  role: Roles
  createdAt: Date
  updatedAt: Date | null
}
