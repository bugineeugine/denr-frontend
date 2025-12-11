import { match } from "path-to-regexp";

export const matchRoute = (path: string, routes: string[]): string | undefined => {
  return routes.find((pattern) => {
    const isMatch = match(pattern, { decode: decodeURIComponent })(path);
    return isMatch !== false;
  });
};

export const adminRoutes: Record<string, string[]> = {
  "/users": ["canViewUsers"],
  "/users/admin": ["canViewUsers"],
  "/users/officer": ["canViewUsers"],
  "/users/applicant": ["canViewUsers"],
  "/users/validator": ["canViewUsers"],

  "/permits": ["canViewPermits"],
  "/dashboard": ["canViewDashboard"],
  "/home": ["canViewHome"],
  "/application-form": ["canApplicationForm"],
  "/permit/:permitId": ["viewPermit"],
  "/citizen-charter": ["canCitizenCharter"],
  "/citizen": ["canViewCitizen"],
  "/approval/for-approval": ["canViewForApproval"],
  "/approval/history-approve": ["canViewHistoryApprove"],
};

export const hasPermissionMiddleware = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
};
