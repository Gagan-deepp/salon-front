import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const routePermissions = [
    // Most specific routes first - SaaS Owner routes
    {
        paths: ['/admin/companies'], // Changed from /admin/company to /admin/companies
        allowedRoles: ['SAAS_OWNER'],
    },
    
    // Cashier specific routes
    {
        paths: ['/admin/create/payment'],
        allowedRoles: ['CASHIER', 'FRANCHISE_OWNER', 'SUPER_ADMIN'], // Added hierarchical access
    },
    
    // Franchise Owner and above routes
    {
        paths: ['/admin/franchise', '/admin/services', '/admin/products', '/admin/customers', '/admin/payments', '/admin/users'],
        allowedRoles: ['FRANCHISE_OWNER', 'SUPER_ADMIN'], // Removed CASHIER for most routes
    },
    
    // Super Admin only routes
    {
        paths: ['/admin/branches'], // Super admin specific routes
        allowedRoles: ['SUPER_ADMIN'],
    },
    
    // General admin dashboard - most permissive, should be last
    {
        paths: ['/admin'],
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
    if (pathname === "/") {
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
                console.debug("🔄 Redirecting", role, "to:", redirectPath);
                return NextResponse.redirect(new URL(redirectPath, request.url));
            }
        }
        return NextResponse.next(); // Allow access to home page if user is not logged in
    }

    // Get user session for protected routes
    const session = await auth().catch(() => null);
    const userRole = session?.user?.role;

    console.debug("👤 User role ==> ", userRole);
    console.debug("🛣️  Middleware pathname ==> ", pathname);

    // Find matching route permission (first match wins due to specific-to-general ordering)
    const matched = routePermissions.find((route) =>
        route.paths.some((path) => {
            // Exact match or starts with path
            const isMatch = pathname === path || pathname.startsWith(path + '/');
            console.debug(`🎯 Checking ${path} against ${pathname}: ${isMatch}`);
            return isMatch;
        })
    );

    console.debug("✅ Matched route rule:", matched);

    // Allow all non-protected routes
    if (!matched) {
        console.debug("🟢 No protection needed for:", pathname);
        return NextResponse.next();
    }

    // Not logged in user redirect to login page
    if (!userRole) {
        console.debug("🔐 No user role, redirecting to login");
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if user role is allowed
    const isAllowed = matched.allowedRoles.includes(userRole);
    console.debug("🔍 Role check:", userRole, "allowed:", matched.allowedRoles, "result:", isAllowed);

    if (!isAllowed) {
        console.debug("❌ Role not allowed, redirecting to login");
        return NextResponse.redirect(new URL('/', request.url));
    }

    console.debug("✅ Access granted for:", pathname);
    return NextResponse.next();
}
