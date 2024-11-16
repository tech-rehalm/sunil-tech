import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string | null
      firstname?: string | null
      email?: string | null
      isAdmin?: boolean
    } & DefaultSession['user']
  }

  export interface User extends DefaultUser {
    _id?: string
    isAdmin?: boolean
    firstname?: string
    email?: string
  }
}
