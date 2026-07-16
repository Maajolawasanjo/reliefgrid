import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function WeatherIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="10" width="8" height="8" />
      <path d="M12 5l4-4 4 4M16 1v12M21 8h-4" />
      <path d="M7 10V6M4 10V8" />
    </svg>
  );
}

export function InfrastructureIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="2" y="16" width="6" height="6" />
      <rect x="9" y="10" width="6" height="12" />
      <rect x="16" y="4" width="6" height="18" />
    </svg>
  );
}

export function MedicalIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 2v20M2 12h20" />
      <rect x="5" y="5" width="14" height="14" />
    </svg>
  );
}

export function ShelterIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M3 20h18M12 4l9 8H3l9-8z" />
      <rect x="9" y="12" width="6" height="8" />
    </svg>
  );
}

export function LogisticsIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="2" y="4" width="14" height="12" />
      <rect x="16" y="8" width="6" height="8" />
      <circle cx="6" cy="20" r="2" />
      <circle cx="16" cy="20" r="2" />
      <path d="M16 12h6" />
    </svg>
  );
}

export function CommunicationIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 2L2 22h20L12 2zM12 8v6M12 18h.01" />
    </svg>
  );
}

export function CoordinatorIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M12 2v20M2 12h20M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
    </svg>
  );
}

export function IncidentIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 2L2 22h20L12 2z" />
      <path d="M12 9v6M12 17h.01" />
    </svg>
  );
}

export function AlertIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M12 7v6M12 17h.01" />
    </svg>
  );
}

export function MemoryIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M12 3v18" />
    </svg>
  );
}

export function SearchIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M10 10m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0" />
      <path d="M21 21l-6-6" />
    </svg>
  );
}

export function AnalyticsIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-3-3-4 4" />
    </svg>
  );
}

export function ReportsIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="4" y="2" width="16" height="20" />
      <path d="M8 6h8M8 11h8M8 16h5" />
    </svg>
  );
}

export function NotificationIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function SettingsIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function ProfileIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function OrganizationIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

export function UsersIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function AIIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="9" y="9" width="6" height="6" />
      <rect x="3" y="3" width="18" height="18" />
      <path d="M9 1v2M15 1v2M9 21v2M15 21v2M1 9h2M1 15h2M21 9h2M21 15h2" />
    </svg>
  );
}

export function BedrockIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" />
    </svg>
  );
}

export function MapIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zM9 3v15M15 6v15" />
    </svg>
  );
}

export function SatelliteIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
    </svg>
  );
}

export function RouteIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M9 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3h0" />
    </svg>
  );
}

export function ResourcesIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

export function DeploymentIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 2L2 22h20L12 2z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

export function TelemetryIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M3 12h4l3-6 4 12 3-6h4" />
    </svg>
  );
}

export function AuditIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  );
}

export const icons = {
  weather: WeatherIcon,
  infrastructure: InfrastructureIcon,
  medical: MedicalIcon,
  shelter: ShelterIcon,
  logistics: LogisticsIcon,
  communication: CommunicationIcon,
  coordinator: CoordinatorIcon,
  incident: IncidentIcon,
  alert: AlertIcon,
  memory: MemoryIcon,
  search: SearchIcon,
  analytics: AnalyticsIcon,
  reports: ReportsIcon,
  notification: NotificationIcon,
  settings: SettingsIcon,
  profile: ProfileIcon,
  organization: OrganizationIcon,
  users: UsersIcon,
  ai: AIIcon,
  bedrock: BedrockIcon,
  map: MapIcon,
  satellite: SatelliteIcon,
  route: RouteIcon,
  resources: ResourcesIcon,
  deployment: DeploymentIcon,
  telemetry: TelemetryIcon,
  audit: AuditIcon,
};

export type IconName = keyof typeof icons;

interface UnifiedIconProps extends IconProps {
  name: IconName;
}

export function Icon({ name, ...props }: UnifiedIconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}
