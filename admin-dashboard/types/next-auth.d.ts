import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      permissions: {
        manageDeals: boolean
        manageUsers: boolean
        manageBanners: boolean
        resolveDisputes: boolean
        manageAdmins: boolean
      } | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    permissions: {
      manageDeals: boolean
      manageUsers: boolean
      manageBanners: boolean
      resolveDisputes: boolean
      manageAdmins: boolean
    } | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    permissions: {
      manageDeals: boolean
      manageUsers: boolean
      manageBanners: boolean
      resolveDisputes: boolean
      manageAdmins: boolean
    } | null
  }
}
