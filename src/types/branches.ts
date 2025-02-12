
export interface Table {
  id: string;
  name: string;
  accepts_reservations: boolean;
}

export interface Section {
  id: string;
  name: string;
  tables: Table[];
}

export interface Branch {
  id: string;
  name: string;
  reference: string;
  accepts_reservations: boolean;
  reservation_duration: number;
  reservation_times: {
    [day: string]: string[][];
  };
  sections: Section[];
}

export interface BranchUpdatePayload {
  accepts_reservations?: boolean;
  reservation_duration?: number;
  reservation_times?: {
    [day: string]: string[][];
  };
}