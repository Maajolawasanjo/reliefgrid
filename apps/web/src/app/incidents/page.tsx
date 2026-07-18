'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { env } from '@/lib/config';
import { useLocation } from '@/lib/location-context';
import { CreateIncidentModal } from '@/components/widgets/create-incident-modal';
import { AgentTimelineWidget } from '@/components/widgets/agent-timeline-widget';
import { GISMapWidget } from '@/components/widgets/gis-map-widget';
import { RecommendationsWidget } from '@/components/widgets/recommendations-widget';
import { Icon } from '@/components/ui/icons';
import { FullLogo } from '@/components/ui/logo';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  latitude: number;
  longitude: number;
  affected_population: number;
  created_at: string;
}

export default function IncidentsDashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const {
    latitude: opLat,
    longitude: opLon,
    city: opCity,
    state: opState,
    country: opCountry,
    street: opStreet,
    displayName: opDisplayName,
    source: opSource,
    requestGeolocation,
    updateManualLocation,
    permissionStatus
  } = useLocation();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Recommendations and GIS integration data
  const [recData, setRecData] = useState<any>(null);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(false);

  const fetchIncidents = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const res = await fetch(`${env.apiUrl}/incidents/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        setIncidents(items);
        if (items.length > 0 && !selectedIncident) {
          setSelectedIncident(items[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load incidents', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (token) {
      fetchIncidents();
    }
  }, [user, isLoading, token]);

  // Load recommendations and OSM GIS structures when incident is selected
  useEffect(() => {
    if (!selectedIncident || !token) {
      setRecData(null);
      return;
    }
    setLoadingRecs(true);
    fetch(`${env.apiUrl}/analytics/incidents/${selectedIncident.id}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setRecData(d))
      .catch((err) => console.error('Failed to load incident recommendations context', err))
      .finally(() => setLoadingRecs(false));
  }, [selectedIncident, token]);

  if (isLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400 font-body">Authenticating operator context...</div>;
  }

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/15 text-red-300 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/40';
    }
  };

  const handleStatusChange = async (incidentId: string, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    try {
      const res = await fetch(`${env.apiUrl}/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchIncidents();
      }
    } catch (err) {
      console.error('Failed to update incident status', err);
    }
  };

  const handleDeleteIncident = async (incidentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    if (!confirm('Are you sure you want to delete this incident report?')) return;
    try {
      const res = await fetch(`${env.apiUrl}/incidents/${incidentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        if (selectedIncident?.id === incidentId) {
          setSelectedIncident(null);
        }
        fetchIncidents();
      }
    } catch (err) {
      console.error('Failed to delete incident', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 text-slate-100 font-body">
      
      {/* Top Header Section */}
      <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-slate-800 pb-6 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/incidents" title="Return to Emergency Command Center">
            <FullLogo iconSize="h-11 w-11" textClass="text-2xl" subtitle={false} />
          </Link>
          <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />
          <div>
            <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9AF376] animate-pulse" />
              Emergency Command Center
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Autonomous Multi-Agent Crisis Platform & Real-Time GIS Matrix</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
          <nav className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 text-xs font-bold">
            <button onClick={() => router.push('/incidents')} className="rounded-lg bg-[#9AF376]/15 border border-[#9AF376]/30 text-[#9AF376] px-3.5 py-2 flex items-center gap-1.5 font-bold shadow">
              <Icon name="incident" size={15} /> Incidents
            </button>
            <button onClick={() => router.push('/executive')} className="rounded-lg px-3.5 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 flex items-center gap-1.5 font-bold transition-all">
              <Icon name="analytics" size={15} /> Executive View
            </button>
            <button onClick={() => router.push('/memory')} className="rounded-lg px-3.5 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 flex items-center gap-1.5 font-bold transition-all">
              <Icon name="memory" size={15} /> Memory Engine
            </button>
            <button onClick={() => router.push('/telemetry')} className="rounded-lg px-3.5 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 flex items-center gap-1.5 font-bold transition-all">
              <Icon name="telemetry" size={15} /> Telemetry
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-[#9AF376] px-4 py-2.5 text-xs font-extrabold text-slate-950 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(154,243,118,0.25)] flex items-center gap-1.5"
            >
              <Icon name="alert" size={15} /> File Incident Report
            </button>

            <button
              onClick={logout}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Geolocation Operational Context bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 mb-6 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-slate-400 font-bold uppercase tracking-wider font-mono">Active Command Sector:</span>
          <span className="text-slate-100 font-black text-sm">📍 {opStreet || opCity}, {opCity}</span>
          <span className="text-slate-400 font-mono text-xs">({opLat.toFixed(4)}, {opLon.toFixed(4)})</span>
          <span className="text-slate-400 text-xs hidden xl:inline truncate max-w-[320px]">| {opDisplayName}</span>
          <span className={`px-2.5 py-0.5 rounded border text-[11px] font-bold uppercase tracking-wider font-mono ${
            opSource === 'gps' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' :
            opSource === 'manual' ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' :
            'bg-slate-800 border-slate-700 text-slate-300'
          }`}>
            {opSource === 'gps' ? 'GPS Grounded' : opSource === 'manual' ? 'Manual Override' : 'Org Default'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={requestGeolocation}
            className="rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 px-3.5 py-1.5 font-bold text-slate-100 transition-all flex items-center gap-1.5 text-xs"
          >
            📍 Sync GPS Location
          </button>
          
          <select
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              if (val === 'custom') {
                const latStr = prompt('Enter Latitude:');
                const lonStr = prompt('Enter Longitude:');
                if (latStr && lonStr) {
                  updateManualLocation(parseFloat(latStr), parseFloat(lonStr), 'Custom Sector', 'Custom Region', 'Coordinates Override');
                }
                return;
              }
              const [lat, lon, city, state, country] = val.split('|');
              updateManualLocation(parseFloat(lat), parseFloat(lon), city, state, country);
            }}
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 font-bold text-slate-200 focus:outline-none text-xs"
          >
            <option value="">-- Switch Sectors --</option>
            <option value="6.5244|3.3792|Lagos|Lagos State|Nigeria">Lagos, Nigeria</option>
            <option value="-1.2921|36.8219|Nairobi|Nairobi County|Kenya">Nairobi, Kenya</option>
            <option value="29.7604|-95.3698|Houston|Texas|United States">Houston, USA</option>
            <option value="35.6762|139.6503|Tokyo|Tokyo Prefecture|Japan">Tokyo, Japan</option>
            <option value="custom">Enter Custom Coordinates...</option>
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Left Column: Incident Feed List */}
        <div className="space-y-4 lg:sticky lg:top-8 max-h-[calc(100vh-230px)] overflow-y-auto pr-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between font-mono">
            <span>Active Incidents Feed</span>
            <span className="text-xs font-mono lowercase bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
              {incidents.length} total
            </span>
          </h2>
          {loadingData ? (
            <div className="py-8 text-slate-400 text-center font-medium text-sm">Loading incidents...</div>
          ) : incidents.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-300 text-sm">
              No active incidents reported.
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all shadow-lg ${
                  selectedIncident?.id === inc.id
                    ? 'border-[#9AF376] bg-[#9AF376]/10 ring-1 ring-[#9AF376]/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-extrabold uppercase font-mono ${getSeverityBadge(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={inc.status}
                      onChange={(e) => handleStatusChange(inc.id, e.target.value, e as any)}
                      className="text-[11px] font-mono font-bold bg-slate-950 text-slate-200 border border-slate-700 rounded-md px-2 py-0.5 focus:outline-none focus:border-[#9AF376]"
                    >
                      <option value="REPORTED">REPORTED</option>
                      <option value="EXECUTING">EXECUTING</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>

                    <button
                      onClick={(e) => handleDeleteIncident(inc.id, e)}
                      title="Delete Incident"
                      className="p-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-xs font-mono font-bold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-slate-100">{inc.title}</h3>
                <p className="text-xs text-slate-300 font-normal mt-1.5 leading-relaxed line-clamp-2">{inc.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>📍 {inc.latitude.toFixed(2)}, {inc.longitude.toFixed(2)}</span>
                  <span>Pop: {inc.affected_population?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>


        {/* Right Columns: Interactive GIS Map + Agent Timeline + Recommendation Explainability */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIncident ? (
            <>
              <GISMapWidget
                latitude={selectedIncident.latitude}
                longitude={selectedIncident.longitude}
                title={selectedIncident.title}
                severity={selectedIncident.severity}
                gisData={recData}
              />
              <AgentTimelineWidget incidentId={selectedIncident.id} token={token} />
              <RecommendationsWidget 
                incidentId={selectedIncident.id} 
                token={token} 
                data={recData}
                loading={loadingRecs}
              />
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-300 font-medium">
              Select an incident from the feed to activate real-time GIS mapping, Bedrock agents, and recommendations.
            </div>
          )}
        </div>
      </div>

      <CreateIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchIncidents}
        token={token}
      />
    </div>
  );
}
