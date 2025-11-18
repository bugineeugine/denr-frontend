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
