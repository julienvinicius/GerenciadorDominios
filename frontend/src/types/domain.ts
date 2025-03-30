import type { Registrar } from './registrar'

export interface Domain {
  id: string;
  name: string;
  status: 'active' | 'expired' | 'expiring' | 'pending';
  registrar_id: string;
  registrar?: Registrar;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  expiration_date: string;
  auto_renew: boolean;
  notes?: string;
  dnsRecords?: DnsRecord[];
}

export interface DNSRecord {
  id: string;
  domainId: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
  name: string;
  content: string;
  ttl: number;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DomainFormData {
  name: string;
  registrar_id: string;
  status: Domain['status'];
  expiration_date: string;
}

export interface DomainState {
  domains: Domain[];
  currentDomain: Domain | null;
  loading: boolean;
  error: string | null;
}

export interface DomainTransfer {
  id: string;
  domainId: string;
  fromRegistrar: string;
  toRegistrar: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  startDate: string;
  estimatedCompletionDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
  progress?: number;
  authCode?: string;
  transferCost?: number;
  transferFee?: number;
  transferStatus?: {
    step: number;
    description: string;
    completed: boolean;
    error?: string;
  }[];
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  loginAttempts: number;
  sessionTimeout: number;
  passwordExpiration: number;
  ipWhitelist: string;
  lastPasswordChange: string;
}

export interface BackupCode {
  code: string;
  used: boolean;
  createdAt: string;
  usedAt?: string;
}

export interface Session {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  createdAt: string;
}

export interface DnsRecord {
  id: number;
  type: string;
  name: string;
  content: string;
  ttl: number;
} 