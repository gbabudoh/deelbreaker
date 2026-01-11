// NextAuth type augmentation
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      userType: 'user' | 'merchant' | 'admin'
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    userType: 'user' | 'merchant' | 'admin'
  }

  interface JWT {
    id: string
    userType: 'user' | 'merchant' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    userType: 'user' | 'merchant' | 'admin'
  }
}