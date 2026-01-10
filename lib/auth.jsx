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
                const result = await login({ email: credentials.email, password: credentials.password })

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
                    companyId: user.companyId,
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
                token.companyId = user.companyId
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
            session.companyId = token.companyId
            return session
        },
        redirect({ url, baseUrl }) {
            console.debug("Redirect URL:", url);
            console.debug("Base URL:", baseUrl);
            return `${baseUrl}/login`;
        },
    },
    pages: {
        signIn: "/login",
    }
})