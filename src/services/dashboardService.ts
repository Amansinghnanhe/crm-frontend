import axios from 'axios';
// ✅ Explicit type-only import bilkul sahi hai
import type { DashboardStats } from '../types/dashboard';

const LEADS_API = 'http://localhost:8080/leads';

// 1. Dashboard statistics fetch karne ke liye 
export const getDashboardStats = async (headers: { Authorization: string }): Promise<DashboardStats> => {
  const response = await axios.get(`${LEADS_API}/dashboard/stats`, { headers });
  return response.data;
};

// 2. Dynamic Server-Side Paging, Filter aur Sorting Exporter (FIXED)
export const getDashboardLeads = async (
  page = 0,
  size = 10,
  sortBy = 'createdAt',
  sortDir = 'desc',
  status = '',
  search = '',
  headers = {} // ⚡ Ensure karo ki yahan { Authorization: `Bearer ${token}` } pass ho raha ho call karte waqt
) => {
  const response = await axios.get(LEADS_API, {
    headers, // ⚡ FIXED: Yahan axios configuration ke andar headers ko inject kiya hai taaki JWT token backend tak jaye
    params: {
      page: page,
      size: size,
      sortBy: sortBy,
      sortDir: sortDir,
      status: status || null, // Empty check bypass configuration
      search: search || null
    }
  });
  return response.data;
};

// 3. Bulk Excel Lead Import Axios Interface
export const importLeadsExcel = async (file: File, token: string): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${LEADS_API}/import`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`, // ✅ Yeh tarika ekdum mast hai
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};