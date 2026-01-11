// @ts-ignore - Module resolution issue
import { NextAuthOptions } from 'next-auth'
// @ts-ignore - Module resolution issue
import { PrismaAdapter } from '@next-auth/prisma-adapter'
// @ts-ignore - Module resolution issue
import GoogleProvider from 'next-auth/providers/google'
// @ts-ignore - Module resolution issue
import AppleProvider from 'next-auth/providers/apple'
// @ts-ignore - Module resolution issue
import AzureADProvider from 'next-auth/providers/azure-ad'
// @ts-ignore - Module resolution issue
import EmailProvider from 'next-auth/providers/email'
// @ts-ignore - Module resolution issue
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check if it's a merchant or user
        if (credentials.userType === 'merchant') {
          const merchant = await prisma.merchant.findUnique({
            where: { email: credentials.email }
          })
          
          if (merchant) {
            // In production, verify password hash
            return {
              id: merchant.id,
              email: merchant.email,
              name: merchant.name,
              userType: 'merchant'
            } as any
          }
        } else {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (user) {
            // In production, verify password hash
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              userType: 'user'
            } as any
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.userType = (user as any).userType || 'user'
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.userType = token.userType as string
      }
      return session
    },
    async signIn({ user, account }: { user: any; account: any; profile: any }) {
      if (account?.provider === 'google') {
        // Create user preferences on first sign in
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          // User will be created by the adapter, but we can set up additional data
          return true
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async createUser({ user }: { user: any }) {
      // Create default notification and privacy settings
      await prisma.notificationSettings.create({
        data: {
          userId: user.id,
          deals: true,
          groupBuys: true,
          priceDrops: true,
          marketing: false,
        }
      })

      await prisma.privacySettings.create({
        data: {
          userId: user.id,
          profileVisible: true,
          shareActivity: false,
          dataCollection: true,
        }
      })
    }
  }
}