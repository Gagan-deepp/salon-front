// export { auth as middleware } from "@/lib/auth"

import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const routePermissions = [
    {
        paths: ['/admin/create/payment'],
        allowedRoles: ['CASHIER', 'FRANCHISE_OWNER'],
    },
    {
        paths: ['/admin/franchise', '/admin/services', '/admin/products', '/admin/create/payment'],
        allowedRoles: ['SUPER_ADMIN', 'FRANCHISE_OWNER'],
    },
    {
        paths: ['/admin', '/admin/services', '/admin/products', '/admin/customers', '/admin/payments', '/admin/branches'],
        allowedRoles: ['SUPER_ADMIN'],
    },

];



export const config = {
    matcher: ["/", "/admin/:path*"],
};

export async function middleware(request) {
    const pathname = request.nextUrl.pathname


    //Don't allow loged in user to come to login page
    if (pathname === "/") {
        const session = await auth().catch(() => null);
        if (session?.user) {

            const role = session.user.role;
            console.debug("User role in middleware ==> ", role)

            if (role === "SUPER_ADMIN") {
                return NextResponse.redirect(new URL("/admin", request.url));
            } else if (role === "FRANCHISE_OWNER") {
                return NextResponse.redirect(new URL("/admin/franchise", request.url));
            } else if (role === "CASHIER") {
                return NextResponse.redirect(new URL("/admin/create/payment", request.url));
            }
        }
        return NextResponse.next(); // allow access to home page if user is not login
    }



    const matched = routePermissions.find((route) =>
        route.paths.some((path) => pathname.startsWith(path))
    );

    const session = await auth()
    const userRole = session?.user?.role

    console.debug("User role ==> ", userRole)
    console.debug("Middleware pathname ==> ", pathname)
    console.debug("\n Is matched => ", matched)


    // Allow all non-protected routes
    if (!matched) {
        return NextResponse.next()
    }

    // Not logged in user redirect to login page
    if (!userRole) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Role not allowed
    if (!matched.allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Everything is okay
    return NextResponse.next()
}
