import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./actions/user-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" },
                password: { label: "Email", type: "password", placeholder: "Enter your password" },
            },
            async authorize(credentials) {
                console.log("Credentials ==> ", credentials)
                const result = await login({ email: credentials.email, password: credentials.password })
                console.log("result of login in auth ==> ", result.data)

                if (!result || !result.success || !result.data) {
                    console.warn("No valid user found")
                    return null
                }
                const user = result.data.data.user;
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    user_role: user.role,
                    franchiseId: user.franchiseId,
                    accessToken: result.data.data.accessToken,
                }

            },
        })
    ],
    callbacks: {
        jwt({ token, user }) {


            if (user) {
                const customUser = user

                token.id = customUser.id
                token.role = customUser.user_role
                token.name = customUser.name;
                token.email = customUser.email;
                token.accessToken = customUser.accessToken
                token.franchiseId = user.franchiseId
            }


            return token
        },
        session({ session, token }) {
            if (token) {
                (session.user) = {
                    email: token.email || "",
                    name: token.name || "",
                    id: (token).id,
                    role: token.role,
                }
            }
            session.accessToken = token.accessToken
            session.franchiseId = token.franchiseId
            return session
        },
        redirect({ baseUrl, token }) {
            if (token) { // Token exists on successful sign-in
                console.log("I am in redirect callback")
                console.log("Redirecting based on user role:", token.role)
                switch (token.role) {
                    case 'FRANCHISE_OWNER':
                        return `${baseUrl}/admin/franchise`;
                    case 'CASHIER':
                        return `${baseUrl}/admin/create/payment`;
                    default:
                        return `${baseUrl}/admin`;
                }
            }
            // Fallback 
            return baseUrl;
        },

        authorized({ request, auth }) {


            const { pathname } = request.nextUrl

            // Skip auth for static files and Next.js internals
            if (
                pathname.startsWith('/_next/') ||
                pathname.startsWith('/api/') ||
                pathname.includes('.') || // files with extensions
                pathname === '/favicon.ico'
            ) {
                return true
            }


            console.log("Auth status", auth)
            const isLoggedIn = !!auth?.user
            console.log("Is logged in", isLoggedIn)
            console.log("Pathname", pathname)
            return true
        }
    },
    pages: {
        signIn: "/login",
    }
})