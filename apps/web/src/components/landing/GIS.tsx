'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/icons';

export function LandingGIS() {
  const [activeLayer, setActiveLayer] = useState<'shelters' | 'hospitals' | 'weather' | 'routes'>('shelters');

  const layers = [
    { id: 'shelters', label: 'Evacuation Shelters', icon: 'shelter', count: '4 Active Hubs' },
    { id: 'hospitals', label: 'Trauma & Hospitals', icon: 'medical', count: '6 Emergency ICUs' },
    { id: 'weather', label: 'Live Rain & Surge', icon: 'weather', count: 'Open-Meteo Stream' },
    { id: 'routes', label: 'OSRM Route Vectors', icon: 'route', count: 'Calculated Corridors' },
  ];

  return (
    <section id="gis" className="py-20 md:py-28 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00D2FF]">
            Grounded Spatial Intelligence
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Interactive Real-Time GIS Matrix.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            ReliefGrid connects directly to public OpenStreetMap, Open-Meteo, and OSRM protocols to map critical infrastructure with meter-level accuracy.
          </p>
        </div>

        {/* GIS Simulator View */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
          {/* Controls Bar */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Icon name="map" size={20} className="text-[#00D2FF]" />
              <div>
                <span className="text-xs font-bold text-slate-100 font-mono">Lagos Coastal Command Sector</span>
                <p className="text-[10px] text-slate-400 font-mono">Lat: 6.5244° N | Lon: 3.3792° E</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    activeLayer === layer.id
                      ? 'bg-[#00D2FF] text-slate-950 border-[#00D2FF] font-extrabold shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <Icon name={layer.icon as any} size={14} className={activeLayer === layer.id ? 'text-slate-950' : 'text-slate-400'} />
                  <span>{layer.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map Visual Mockup */}
          <div className="relative h-96 bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
            {/* Grid Lines Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50 pointer-events-none" />

            {/* Map Markers Overlay based on active layer */}
            <div className="relative z-10 grid md:grid-cols-3 gap-4">
              {activeLayer === 'shelters' && (
                <>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
                    <span className="font-bold">📍 Agege Stadium Hub</span>
                    <p className="text-[11px] text-slate-400">Capacity: 1,200 evacuees | Status: OPEN</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs space-y-1">
                    <span className="font-bold">📍 Lekki Community Hall</span>
                    <p className="text-[11px] text-slate-400">Capacity: 450 evacuees | Status: 85% FULL</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-red-500/40 text-red-300 text-xs space-y-1">
                    <span className="font-bold">📍 Ikeja Centre (REJECTED)</span>
                    <p className="text-[11px] text-slate-400">Memory Warning: Road Submerged</p>
                  </div>
                </>
              )}

              {activeLayer === 'hospitals' && (
                <>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 text-rose-300 text-xs space-y-1">
                    <span className="font-bold">🏥 Lagos University Teaching Hospital</span>
                    <p className="text-[11px] text-slate-400">ICU Beds: 24 available | Trauma Level 1</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 text-rose-300 text-xs space-y-1">
                    <span className="font-bold">🏥 Island General Hospital</span>
                    <p className="text-[11px] text-slate-400">ICU Beds: 8 available | Triage Active</p>
                  </div>
                </>
              )}

              {activeLayer === 'weather' && (
                <>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs space-y-1">
                    <span className="font-bold">⛈️ Open-Meteo Surge Telemetry</span>
                    <p className="text-[11px] text-slate-400">Precipitation: 68 mm/h | Wind: 42 km/h SE</p>
                  </div>
                </>
              )}

              {activeLayer === 'routes' && (
                <>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/40 text-blue-300 text-xs space-y-1">
                    <span className="font-bold">🛣️ OSRM Primary Corridor</span>
                    <p className="text-[11px] text-slate-400">Lekki Expressway ➔ Agege Hub (24 min)</p>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Status bar */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
              <span>Feeds: OpenStreetMap (OSM) + OSRM Engine</span>
              <span>Layer Status: {layers.find(l => l.id === activeLayer)?.count}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
