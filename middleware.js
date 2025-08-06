// export { auth as middleware } from "@/lib/auth"

import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const routePermissions = [
    {
        paths: ['/admin/franchise'],
        allowedRoles: ['SUPER_ADMIN', 'OWNER'],
    },
    {
        paths: ['/admin/product'],
        allowedRoles: ['SUPER_ADMIN'],
    },
    {
        paths: ['/admin/invoice'],
        allowedRoles: ['SUPER_ADMIN', 'CASHIER'],
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
            return NextResponse.redirect(new URL("/admin", request.url));
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
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Everything is okay
    return NextResponse.next()
}
