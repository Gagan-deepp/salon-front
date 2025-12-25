import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const routePermissions = [
    // Most specific routes first - SaaS Owner routes
    {
        paths: ['/admin/companies', '/admin/subscription'], // Changed from /admin/company to /admin/companies
        allowedRoles: ['SAAS_OWNER'],
    },

    // Cashier specific routes
    {
        paths: ['/admin/create/payment', '/admin/payments'],
        allowedRoles: ['CASHIER', 'FRANCHISE_OWNER', 'SUPER_ADMIN'], // Added hierarchical access
    },

    // Franchise Owner and above routes
    {
        paths: ['/admin/franchise', '/admin/services', '/admin/products', '/admin/customers', '/admin/payments', '/admin/users','/admin/offers','/admin/packages','/admin/appointments'],
        allowedRoles: ['FRANCHISE_OWNER', 'SUPER_ADMIN'], // Removed CASHIER for most routes
    },

    // Super Admin only routes
    {
        paths: ['/admin/branches','/admin/offers','/admin/packages'], // Super admin specific routes
        allowedRoles: ['SUPER_ADMIN'],
    },

    // General admin dashboard - most permissive, should be last
    {
        paths: ['/admin','/admin/offers'],
        allowedRoles: ['SUPER_ADMIN', 'FRANCHISE_OWNER', 'CASHIER'], // All admin users can access base dashboard
    },
];

export const config = {
    matcher: ["/", "/admin/:path*"],
};

export async function middleware(request) {
    const pathname = request.nextUrl.pathname;

    console.debug("🔍 Middleware processing:", pathname);

    // Handle home page redirects for logged-in users
    if (pathname === "/" || pathname === "/login") {
        const session = await auth().catch(() => null);
        if (session?.user) {
            const role = session.user.role;
            console.debug("📝 Session user in middleware ==> ", session);
            console.debug("👤 User role in middleware ==> ", role);

            // Redirect based on role
            const roleRedirects = {
                "SAAS_OWNER": "/admin/companies", // Fixed redirect path
                "SUPER_ADMIN": "/admin",
                "FRANCHISE_OWNER": "/admin/franchise",
                "CASHIER": "/admin/create/payment"
            };

            const redirectPath = roleRedirects[role];
            if (redirectPath) {
                // console.debug("🔄 Redirecting", role, "to:", redirectPath);
                return NextResponse.redirect(new URL(redirectPath, request.url));
            }
        }
        return NextResponse.next(); // Allow access to home page if user is not logged in
    }

    // Get user session for protected routes
    const session = await auth().catch(() => null);
    const userRole = session?.user?.role;

    // console.debug("\nUser role ==> ", userRole);
    // console.debug(" Middleware pathname ==> ", pathname);

    // Find matching route permission (first match wins due to specific-to-general ordering)
    const matched = routePermissions.find((route) =>
        route.paths.some((path) => {
            // Exact match or starts with path
            const isMatch = pathname === path || pathname.startsWith(path + '/');
            console.debug(`\t\t Checking ${path} against ${pathname}: ${isMatch}`);
            return isMatch;
        })
    );

    // console.debug("\n Matched route rule:", matched);

    // Allow all non-protected routes
    if (!matched) {
        // console.debug("🟢 No protection needed for:", pathname);
        return NextResponse.next();
    }

    // Not logged in user redirect to login page
    if (!userRole) {
        // console.debug("🔐 No user role, redirecting to login");
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if user role is allowed
    const isAllowed = matched.allowedRoles.includes(userRole);
    console.debug("\n\t Role check:", userRole, "allowed:", matched.allowedRoles, "result:", isAllowed);

    if (!isAllowed) {
        console.debug("❌ Role not allowed, redirecting to login");
        return NextResponse.redirect(new URL('/', request.url));
    }

    // console.debug("\nAccess granted for:", pathname);
    return NextResponse.next();
}
