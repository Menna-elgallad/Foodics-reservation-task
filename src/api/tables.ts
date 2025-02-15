
import { Table } from '../types/tables';
import { API_TOKEN } from '@/config';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${API_TOKEN}`,
};

export const changeTableReservation = async (tableId: string ,accepts_reservations:boolean ): Promise<Table> => {
  const response = await fetch(`/api/tables/${tableId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ accepts_reservations }),
  });
  if (!response.ok) throw new Error('Failed to update table');
  const data = await response.json();
  return data.data;
};

