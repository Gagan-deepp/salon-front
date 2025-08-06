import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./actions/auth";

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
            return session
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


            if (pathname === "/admin/*" && !isLoggedIn) {
                return Response.redirect(new URL("/", request.nextUrl))
            }
            if (pathname === "/" && isLoggedIn) {
                return Response.redirect(new URL("/admin", request.nextUrl))
            }

            // Allow everyone to access all pages (no protection)
            return true
        }
    },
    pages: {
        signIn: "/",
    }
})