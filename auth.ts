import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import connectDB from "./lib/db"
import NextAuth from "next-auth"
import { User } from "./models/UserModel"

export const config = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: "email" },
                password: { type: "password" }
            },
            async authorize(credentials) {
                await connectDB()
                if (credentials == null) return null
                const user = await User.findOne({ email: credentials.email })
                if (user) {
                    const isMatched = await bcrypt.compare(credentials.password as string, user.password)
                    if (isMatched) {
                        return user
                    }
                }
                return null
            }
        }),
    ],
    pages: {
        signIn: "/signin",
        newUser: "/register",
    },
    callbacks: {
        async jwt({ user, trigger, session, token }: any) {
            if (user) {
                token.user = {
                    _id: user._id,
                    firstname: user.firstname,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            }
            if (trigger === "update" && session) {
                token.user = {
                    ...token.user,
                    firstname: session.user.firstname,
                    email: session.user.email,
                }
            }
            return token
        },
        session: async ({ session, token }: any) => {
            if (token) {
                session.user = token.user
            }
            return session
        }
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth(config)