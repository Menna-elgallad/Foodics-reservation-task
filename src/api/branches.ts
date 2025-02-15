import { Branch, BranchUpdatePayload } from "../types/branches";
import { API_TOKEN } from "@/config";

const API_BASE = process.env.VUE_APP_API_BASE; // Get base URL dynamically

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};

// Fetch branches
export const fetchBranches = async (): Promise<Branch[]> => {
  const response = await fetch(`${API_BASE}/branches?include[0]=sections&include[1]=sections.tables`, {
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch branches");
  const data = await response.json();
  return data.data;
};

// Update branch
export const updateBranch = async (branchId: string, payload: BranchUpdatePayload): Promise<Branch> => {
  const response = await fetch(`${API_BASE}/branches/${branchId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update branch");
  const data = await response.json();
  return data.data;
};

// Change reservation status for a branch
export const ChangeReservationsForBranch = async (branchId: string, accepts_reservations: boolean): Promise<void> => {
  await fetch(`${API_BASE}/branches/${branchId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ accepts_reservations }),
  });
};
