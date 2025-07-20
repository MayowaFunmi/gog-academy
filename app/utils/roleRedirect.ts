export const roleDashboardPaths: Record<string, string> = {
  SuperAdmin: "/admin/dashboard",
  Student: "/student/dashboard",
};

export function getDashboardPathByRole(role?: string): string {
  return roleDashboardPaths[role || ""] || "/auth/login";
}
