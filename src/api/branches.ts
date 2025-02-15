

import { Branch, BranchUpdatePayload } from '../types/branches';
import { API_TOKEN } from '@/config';


const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${API_TOKEN}`,
};

export const fetchBranches = async (): Promise<Branch[]> => {
  const response = await fetch(`/api/branches?include[0]=sections&include[1]=sections.tables`, {
    headers,
  });
  if (!response.ok) throw new Error('Failed to fetch branches');
  const data = await response.json();
  return data.data
};

export const updateBranch = async (branchId: string, payload: BranchUpdatePayload): Promise<Branch> => {
  const response = await fetch(`/api/branches/${branchId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update branch');
  const data = await response.json();
  return data.data;
};

export const ChangeReservationsForBranch = async (branchId: string , accepts_reservations :boolean ): Promise<void> => {
  await fetch(`/api/branches/${branchId}`, {
    method: 'PUT',
    headers ,
    body: JSON.stringify({ accepts_reservations }),
  });
};
