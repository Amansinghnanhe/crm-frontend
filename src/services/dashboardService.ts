// src/services/dashboardService.ts
import axios from 'axios';
// import { DashboardStats } from '../types/dashboard';
import { DashboardStats } from '../types/dashboard';

const LEADS_API = 'http://localhost:8080/leads';

export const getDashboardStats = async (headers: { Authorization: string }): Promise<DashboardStats> => {
  const response = await axios.get(`${LEADS_API}/dashboard/stats`, { headers });
  return response.data;
};