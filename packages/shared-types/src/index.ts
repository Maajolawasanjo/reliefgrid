export interface UserSession {
  userId: string;
  email: string;
  organizationId: string;
  role: 'ADMIN' | 'COORDINATOR' | 'DISPATCHER' | 'OBSERVER';
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  latitude: number;
  longitude: number;
  status: 'REPORTED' | 'TRIAGED' | 'ACTIVE' | 'RESOLVED';
  createdAt: string;
}
