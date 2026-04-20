import { PermitDataType } from "./permit";

export type DashboardDatatype = {
  permitsToday: number;
  totalPermits: number;
  permitsThisWeek: number;
  permitsThisMonth: number;
  permitsByYear: PermitsByYearType[];
  permitsByStatus: PermitsByStatusType[];
  latestPermits: PermitDataType[];
  permitByUserId: PermitDataType[];
  allPermit: PermitDataType[];
  violationStats?: {
    total: number;
    open: number;
    resolved: number;
    thisMonth: number;
    bySeverity: { severity: string; total: number }[];
    byType: { violation_type: string; total: number }[];
  };
  topViolatorLocations?: { location: string; total: number; lat: number; lng: number }[];
  dssAlerts?: { level: "info" | "warning" | "high" | "critical"; title: string; message: string }[];
  expiredPermitCount?: number;
  expiringSoonCount?: number;
};

export type PermitsByYearType = {
  year: number;
  total: number;
  Transport: number;
  Event: number;
  Business: number;
  Construction: number;
};

export type PermitsByStatusType = {
  status: string;
  total: number;
};
