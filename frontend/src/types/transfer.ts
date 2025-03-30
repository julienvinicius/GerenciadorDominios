export interface Transfer {
  id: number;
  domain_id: number;
  domain?: {
    id: number;
    name: string;
  };
  from_registrar: string;
  to_registrar: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  start_date: string;
  estimated_completion_date: string;
  created_at: string;
  updated_at: string;
} 