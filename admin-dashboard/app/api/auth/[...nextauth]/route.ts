import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid email or password')
        }

        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
          include: { permissions: true }
        })

        if (!admin) {
          throw new Error('No admin user found')
        }

        const isValid = await bcrypt.compare(credentials.password, admin.passwordHash)

        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          permissions: admin.permissions ? {
            manageDeals: admin.permissions.manageDeals,
            manageUsers: admin.permissions.manageUsers,
            manageBanners: admin.permissions.manageBanners,
            resolveDisputes: admin.permissions.resolveDisputes,
            manageAdmins: admin.permissions.manageAdmins,
          } : null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.permissions = (user as any).permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).permissions = token.permissions;
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
