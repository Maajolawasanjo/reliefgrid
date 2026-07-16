'use client';

import React, { useState } from 'react';
import { env } from '@/lib/config';
import { useLocation } from '@/lib/location-context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string | null;
}

export function CreateIncidentModal({ isOpen, onClose, onSuccess, token }: Props) {
  const { latitude: opLat, longitude: opLon, displayName: opDisplayName } = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [latitude, setLatitude] = useState(opLat.toString());
  const [longitude, setLongitude] = useState(opLon.toString());
  const [affectedPopulation, setAffectedPopulation] = useState('500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Address search query state
  const [streetQuery, setStreetQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedAddress, setGeocodedAddress] = useState('');

  // Update form coordinates if operational location shifts
  React.useEffect(() => {
    if (isOpen) {
      setLatitude(opLat.toString());
      setLongitude(opLon.toString());
      setGeocodedAddress('');
      setStreetQuery('');
    }
  }, [isOpen, opLat, opLon]);

  if (!isOpen) return null;

  const handleGeocode = async () => {
    if (!streetQuery.trim()) return;
    setIsGeocoding(true);
    setGeocodedAddress('');
    setError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(streetQuery)}&format=json&limit=1`,
        {
          headers: { 'User-Agent': 'ReliefGrid-Disaster-Coordination-Platform' }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const place = data[0];
          setLatitude(place.lat);
          setLongitude(place.lon);
          setGeocodedAddress(place.display_name);
        } else {
          throw new Error('Address not found. Please specify city name or try a different street.');
        }
      } else {
        throw new Error('Address resolution server unavailable.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${env.apiUrl}/incidents/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          severity,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          affected_population: parseInt(affectedPopulation, 10),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to create incident report');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-100">File Emergency Incident Report</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-bold">✕</button>
        </div>
        
        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Incident Title</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
              placeholder="e.g. Coastal Flash Flood Alert"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description & Situation Details</label>
            <textarea
              required
              rows={2}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none resize-none"
              placeholder="Provide situational summary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Dynamic Geocoding Address Lookup */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-850 space-y-2">
            <label className="block text-[11px] font-bold uppercase text-slate-400">Geospatial Street Lookup</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                placeholder="Type street name, city (e.g. Broad Street, Lagos)"
                value={streetQuery}
                onChange={(e) => setStreetQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGeocode();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleGeocode}
                disabled={isGeocoding}
                className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 disabled:opacity-50 transition-all"
              >
                {isGeocoding ? 'Locating...' : 'Verify Location'}
              </button>
            </div>
            {geocodedAddress ? (
              <p className="text-[10px] text-emerald-400 font-semibold">
                ✓ Resolved: <span className="text-slate-300 font-normal">{geocodedAddress}</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-500">
                Sector default: <span className="text-slate-400 font-normal">{opDisplayName}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Severity Level</label>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="CRITICAL">CRITICAL (Breach)</option>
                <option value="HIGH">HIGH (Severe)</option>
                <option value="MEDIUM">MEDIUM (Moderate)</option>
                <option value="LOW">LOW (Localized)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Affected Population</label>
              <input
                type="number"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                value={affectedPopulation}
                onChange={(e) => setAffectedPopulation(e.target.value)}
              />
            </div>
          </div>

          {/* Coordinate details (Read-only by default to avoid manual coordinate mistakes) */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-400 focus:outline-none"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-400 focus:outline-none"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Dispatching...' : 'Dispatch Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
