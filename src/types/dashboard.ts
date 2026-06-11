// src/types/dashboard.ts

export interface LeadStatusCount {
  status: string;
  count: number;
}

export interface DashboardStats {
  totalLeads: number;
  totalActivities: number;
  leadBYStatus: LeadStatusCount[];
}