'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/icons';

interface Props {
  latitude: number;
  longitude: number;
  title: string;
  severity: string;
  gisData?: any;
}

export function GISMapWidget({ latitude, longitude, title, severity, gisData }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<Record<string, any>>({});
  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    shelters: true,
    hospitals: true,
    routes: true,
    weather: true,
  });
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet CDN Assets Dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Leaflet is already loaded
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const cssId = 'leaflet-cdn-css';
    const jsId = 'leaflet-cdn-js';

    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById(jsId)) {
      const script = document.createElement('script');
      script.id = jsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      // If script is already injecting, poll until loaded
      const checkLoaded = setInterval(() => {
        if ((window as any).L) {
          setLeafletLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Destroy existing map if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create Map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([latitude, longitude], 13);
    mapRef.current = map;

    // Add CSS filter for tactical dark-mode openstreetmap
    const darkTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'leaflet-dark-tiles'
    });
    darkTiles.addTo(map);

    // Apply dark filter class styling inject
    const styleId = 'leaflet-dark-tiles-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .leaflet-dark-tiles {
          filter: invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%);
        }
        .leaflet-container {
          background: #0B131A !important;
        }
        .leaflet-popup-content-wrapper {
          background: #162531 !important;
          color: #F8FAFC !important;
          border: 1px solid #1E293B !important;
          border-radius: 12px !important;
        }
        .leaflet-popup-tip {
          background: #162531 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Initialize layer groups
    layersRef.current = {
      incidents: L.layerGroup().addTo(map),
      shelters: L.layerGroup().addTo(map),
      hospitals: L.layerGroup().addTo(map),
      routes: L.layerGroup().addTo(map),
      weather: L.layerGroup().addTo(map), // Hazard radius circle
    };

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, latitude, longitude]);

  // Update Markers & Paths based on gisData
  useEffect(() => {
    if (!mapRef.current || !layersRef.current.incidents) return;
    const L = (window as any).L;
    if (!L) return;

    const layers = layersRef.current;
    
    // Clear old layers
    layers.incidents.clearLayers();
    layers.shelters.clearLayers();
    layers.hospitals.clearLayers();
    layers.routes.clearLayers();
    layers.weather.clearLayers();

    // 1. Plot Incident Marker
    if (activeLayers.incidents) {
      const incidentIcon = L.divIcon({
        html: `<div class="h-6 w-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg animate-pulse"><span class="h-2 w-2 rounded-full bg-white"></span></div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([latitude, longitude], { icon: incidentIcon })
        .bindPopup(`
          <div class="p-1">
            <h4 class="font-bold text-slate-100">${title}</h4>
            <p class="text-[10px] text-red-400 font-semibold mt-0.5">${severity} Threat epicenter</p>
          </div>
        `)
        .addTo(layers.incidents);
    }

    // 2. Plot Hazard Buffer Zone
    if (activeLayers.weather) {
      L.circle([latitude, longitude], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.08,
        radius: 5000, // 5km boundary
        weight: 1.5,
        dashArray: '4 4'
      })
      .bindPopup(`<span class="text-xs text-red-300 font-semibold font-mono">5km Critical Hazard Radius</span>`)
      .addTo(layers.weather);
    }

    if (!gisData) return;

    // 3. Plot Hospitals
    if (activeLayers.hospitals && gisData.hospitals?.data) {
      gisData.hospitals.data.forEach((hosp: any) => {
        const hospIcon = L.divIcon({
          html: `<div class="h-6 w-6 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center shadow-md hover:scale-110 transition-transform"><span class="text-[10px] font-bold text-white">H</span></div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const liveLabel = gisData.hospitals.source === 'live' ? '' : ' <span class="text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded ml-1">Simulated</span>';
        L.marker([hosp.latitude, hosp.longitude], { icon: hospIcon })
          .bindPopup(`
            <div class="p-1 space-y-1">
              <h4 class="font-bold text-blue-300">${hosp.name}${liveLabel}</h4>
              <p class="text-[10px] text-slate-400">Distance: ${hosp.distance_km} km</p>
              ${hosp.capacity_occupancy_percent ? `<p class="text-[10px] text-slate-300">Triage occupancy: ${hosp.capacity_occupancy_percent}%</p>` : ''}
            </div>
          `)
          .addTo(layers.hospitals);
      });
    }

    // 4. Plot Shelters
    if (activeLayers.shelters && gisData.shelters?.data) {
      gisData.shelters.data.forEach((shelter: any) => {
        const shelterIcon = L.divIcon({
          html: `<div class="h-6 w-6 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center shadow-md hover:scale-110 transition-transform"><span class="text-[10px] font-bold text-white">S</span></div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const liveLabel = gisData.shelters.source === 'live' ? '' : ' <span class="text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded ml-1">Simulated</span>';
        L.marker([shelter.latitude, shelter.longitude], { icon: shelterIcon })
          .bindPopup(`
            <div class="p-1 space-y-1">
              <h4 class="font-bold text-emerald-300">${shelter.name}${liveLabel}</h4>
              <p class="text-[10px] text-slate-400">Distance: ${shelter.distance_km} km</p>
              ${shelter.capacity ? `<p class="text-[10px] text-slate-300">Capacity: ${shelter.occupancy || 0} / ${shelter.capacity}</p>` : ''}
            </div>
          `)
          .addTo(layers.shelters);
      });
    }

    // 5. Plot Fire Stations
    if (activeLayers.shelters && gisData.fire_stations?.data) {
      gisData.fire_stations.data.forEach((fire: any) => {
        const fireIcon = L.divIcon({
          html: `<div class="h-6 w-6 rounded-full bg-amber-600 border-2 border-slate-900 flex items-center justify-center shadow-md"><span class="text-[10px] font-bold text-white">F</span></div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        L.marker([fire.latitude, fire.longitude], { icon: fireIcon })
          .bindPopup(`
            <div class="p-1">
              <h4 class="font-bold text-amber-400">${fire.name}</h4>
              <p class="text-[10px] text-slate-400">Fire Response Center (${fire.distance_km} km)</p>
            </div>
          `)
          .addTo(layers.shelters);
      });
    }

    // 6. Plot OSRM routing lines
    if (activeLayers.routes) {
      if (gisData.shelt_route?.geometry) {
        // coordinates come in [lon, lat] from OSRM GeoJSON, convert to [lat, lon]
        const latLons = gisData.shelt_route.geometry.map((c: number[]) => [c[1], c[0]]);
        L.polyline(latLons, {
          color: '#10b981',
          weight: 4,
          opacity: 0.8,
          dashArray: gisData.shelt_route.source === 'live' ? '' : '5 5'
        })
        .bindPopup(`
          <div class="p-1">
            <span class="font-semibold text-emerald-300 text-xs">Clearance Supply Corridor</span>
            <p class="text-[10px] text-slate-400 mt-0.5">Route length: ${gisData.shelt_route.distance_km} km (${gisData.shelt_route.duration_mins}m duration)</p>
          </div>
        `)
        .addTo(layers.routes);
      }

      if (gisData.hosp_route?.geometry) {
        const latLons = gisData.hosp_route.geometry.map((c: number[]) => [c[1], c[0]]);
        L.polyline(latLons, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
          dashArray: gisData.hosp_route.source === 'live' ? '' : '5 5'
        })
        .bindPopup(`
          <div class="p-1">
            <span class="font-semibold text-blue-300 text-xs">Primary Triage Transit Corridor</span>
            <p class="text-[10px] text-slate-400 mt-0.5">Route length: ${gisData.hosp_route.distance_km} km (${gisData.hosp_route.duration_mins}m duration)</p>
          </div>
        `)
        .addTo(layers.routes);
      }
    }

    // Center map view on epicentre + closest hospital bounds
    if (gisData.hospitals?.data?.length > 0) {
      const bounds = L.latLngBounds([
        [latitude, longitude],
        [gisData.hospitals.data[0].latitude, gisData.hospitals.data[0].longitude]
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [gisData, activeLayers, latitude, longitude, title, severity]);

  // Handle Layer Toggle additions/removals
  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => {
      const updated = { ...prev, [layer]: !prev[layer] };
      if (mapRef.current && layersRef.current[layer]) {
        if (updated[layer]) {
          layersRef.current[layer].addTo(mapRef.current);
        } else {
          layersRef.current[layer].remove();
        }
      }
      return updated;
    });
  };

  const isMocked = !gisData || (gisData.hospitals?.source === 'simulated' && gisData.shelters?.source === 'simulated');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Icon name="map" size={20} className="text-brand-500 animate-pulse" /> Live Tactical GIS Map Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            Real-time OpenStreetMap feeds & OSRM routing networks
            {isMocked && (
              <span className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                Using simulated data
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 font-mono text-[11px]">
          <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">Lat: {latitude.toFixed(4)}</span>
          <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">Lon: {longitude.toFixed(4)}</span>
        </div>
      </div>

      {/* GIS Layer Controls */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => toggleLayer('incidents')}
          className={`rounded-lg px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
            activeLayers.incidents ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <Icon name="alert" size={14} /> Crisis Center
        </button>
        <button
          onClick={() => toggleLayer('shelters')}
          className={`rounded-lg px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
            activeLayers.shelters ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <Icon name="shelter" size={14} /> Shelters ({gisData?.shelters?.data?.length || 0})
        </button>
        <button
          onClick={() => toggleLayer('hospitals')}
          className={`rounded-lg px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
            activeLayers.hospitals ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <Icon name="medical" size={14} /> Hospitals ({gisData?.hospitals?.data?.length || 0})
        </button>
        <button
          onClick={() => toggleLayer('routes')}
          className={`rounded-lg px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
            activeLayers.routes ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <Icon name="route" size={14} /> Logistics Routes
        </button>
        <button
          onClick={() => toggleLayer('weather')}
          className={`rounded-lg px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
            activeLayers.weather ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <Icon name="weather" size={14} /> Hazard Buffer
        </button>
      </div>

      {/* Dynamic Leaflet Map Canvas Box */}
      <div 
        ref={mapContainerRef} 
        className="relative h-[340px] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center z-10"
      >
        {!leafletLoaded && (
          <div className="text-slate-400 font-semibold flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
            Loading Leaflet Vector Map Tiles...
          </div>
        )}
      </div>
    </div>
  );
}
