import { NextResponse } from "next/server";
import { verifyJWT } from "../providers/jwtProvider";

/**
 * Middleware to protect API routes with JWT auth and optional role-based access.
 * 
 * @param {Function} handler - The API route handler function.
 * @param {string[]} allowedRoles - Roles allowed to access the route.
 * @returns {Function} - A Next.js route handler.
 */
export function authMiddleware(handler, allowedRoles = []) {
  return async function (request) {
    try {
      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyJWT(token);

      if (allowedRoles.length > 0) {
        const userRoles = decoded.roles || [];
        const hasAccess = allowedRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasAccess) {
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
      }

      // Pass user info to the handler
      return await handler({ request, user: decoded });
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}
