import axios from 'axios';
// Explicit type-only import bilkul sahi hai
import type { DashboardStats } from '../types/dashboard';

const LEADS_API = 'http://localhost:8080/leads';

/**
 * 1. Dashboard Statistics Fetch Interface
 * Top analytics blocks (Total Leads, New Queue, Qualified, etc.) ke data ko sync karta hai.
 */
export const getDashboardStats = async (headers: { Authorization: string }): Promise<DashboardStats> => {
  const response = await axios.get(`${LEADS_API}/dashboard/stats`, { headers });
  return response.data;
};

/**
 * 2. Dynamic Server-Side Paging, Filter aur Sorting Exporter (FIXED)
 * Backend API ke pagination logic ke sath query params bind karta hai.
 * Default sort param ko 'createdAt' se badal kar 'activityDate' kiya hai taaki dynamic query bypass ho sake.
 */
export const getDashboardLeads = async (
  page = 0,
  size = 10,
  sortBy = 'activityDate', // ✅ FIXED: Default parameter database configuration ke mutabik sync hai
  sortDir = 'desc',
  status = '',
  search = '',
  headers = {} 
) => {
  const response = await axios.get(LEADS_API, {
    headers, 
    params: {
      page: page,
      size: size,
      sortBy: sortBy,
      sortDir: sortDir,
      status: status || null, // Empty string check taaki global criteria block na ho
      search: search || null  // Search query empty hone par parameter bypass ho jata hai
    }
  });
  return response.data;
};

/**
 * 3. Bulk Excel Lead Import Axios Interface
 * Multiple leads ki Excel file ko chunk form me backend API standard mapping endpoint par stream karta hai.
 */
export const importLeadsExcel = async (file: File, token: string): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${LEADS_API}/import`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`, 
      "Content-Type": "multipart/form-data" // File binary handling metadata configuration
    }
  });

  return response.data;
};