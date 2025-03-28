export interface Domain {
  id: string;
  name: string;
  registrar: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  expirationDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  dnsRecords: DnsRecord[];
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
  registrar: string;
  expirationDate: string;
  notes?: string;
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
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
} 