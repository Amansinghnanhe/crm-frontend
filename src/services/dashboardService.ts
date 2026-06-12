// src/services/dashboardService.ts
import axios from 'axios';
import { DashboardStats } from '../types/dashboard';

const LEADS_API = 'http://localhost:8080/leads';

// 1. Existing Function: Dashboard ke statistics fetch karne ke liye (Isme koi change nahi hai)
export const getDashboardStats = async (headers: { Authorization: string }): Promise<DashboardStats> => {
  const response = await axios.get(`${LEADS_API}/dashboard/stats`, { headers });
  return response.data;
};

// =========================================================================
// 🔥 NEW ADDED: BULK EXCEL LEAD IMPORT AXIOS INTERFACE
// =========================================================================
export const importLeadsExcel = async (file: File, token: string): Promise<{ success: boolean; message: string }> => {
  // 1. Raw binary file payload ko transport karne ke liye FormData object banaya
  const formData = new FormData();
  formData.append("file", file); // Yeh Java controller ke @RequestParam("file") se direct map hoga

  // 2. Axios post request trigger ki tumhare configured LEADS_API router par
  const response = await axios.post(`${LEADS_API}/import`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`, // Bearer token validation context layer ke liye
      "Content-Type": "multipart/form-data" // Browser engine ko multi-part packet configuration batane ke liye
    }
  });

  return response.data;
};