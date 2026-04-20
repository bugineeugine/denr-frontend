export type ViolationSeverity = "Low" | "Medium" | "High" | "Critical";
export type ViolationStatus = "Open" | "Investigating" | "Resolved" | "Dismissed";

export type ViolationDataType = {
  id: string;
  permit_id: string | null;
  violator_name: string;
  contact_number: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  violation_type: string;
  severity: ViolationSeverity;
  description: string;
  date_recorded: string;
  resolved_at: string | null;
  status: ViolationStatus;
  evidence: string | null;
  recorded_by: string;
  created_at: string;
  updated_at: string;
  permit?: {
    id: string;
    permit_no: string;
    permit_type: string;
  } | null;
  recorder?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type ViolationListResponse = {
  message: string;
  data: ViolationDataType[];
};

export type ViolationCreateInput = {
  permit_id?: string | null;
  violator_name: string;
  contact_number?: string;
  location?: string;
  lat?: number | null;
  lng?: number | null;
  violation_type: string;
  severity: ViolationSeverity;
  description: string;
  date_recorded: string;
  status?: ViolationStatus;
};

export type ViolationStats = {
  total: number;
  open: number;
  resolved: number;
  thisMonth: number;
  bySeverity: { severity: string; total: number }[];
  byType: { violation_type: string; total: number }[];
};
