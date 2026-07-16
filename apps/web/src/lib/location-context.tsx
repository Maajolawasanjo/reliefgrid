'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationContextType {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  street: string;
  displayName: string;
  source: 'gps' | 'manual' | 'organization';
  requestGeolocation: () => Promise<void>;
  updateManualLocation: (
    lat: number,
    lon: number,
    city: string,
    state: string,
    country: string,
    street?: string,
    displayName?: string
  ) => void;
  isLoading: boolean;
  permissionStatus: PermissionState | 'prompt' | 'unknown';
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_LAT = 6.5244; // Lagos, Nigeria
const DEFAULT_LON = 3.3792;
const DEFAULT_CITY = 'Lagos';
const DEFAULT_STATE = 'Lagos State';
const DEFAULT_COUNTRY = 'Nigeria';
const DEFAULT_STREET = 'Broad Street';
const DEFAULT_DISPLAY_NAME = 'Broad Street, Lagos Island, Lagos, Nigeria';

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [latitude, setLatitude] = useState<number>(DEFAULT_LAT);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LON);
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  const [state, setState] = useState<string>(DEFAULT_STATE);
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY);
  const [street, setStreet] = useState<string>(DEFAULT_STREET);
  const [displayName, setDisplayName] = useState<string>(DEFAULT_DISPLAY_NAME);
  const [source, setSource] = useState<'gps' | 'manual' | 'organization'>('organization');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'prompt' | 'unknown'>('unknown');

  useEffect(() => {
    // Load persisted location operational context
    const saved = localStorage.getItem('reliefgrid_operational_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLatitude(parsed.latitude);
        setLongitude(parsed.longitude);
        setCity(parsed.city);
        setState(parsed.state);
        setCountry(parsed.country);
        setStreet(parsed.street || DEFAULT_STREET);
        setDisplayName(parsed.displayName || DEFAULT_DISPLAY_NAME);
        setSource(parsed.source);
      } catch (e) {
        console.error('Failed to restore location preference', e);
      }
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        setPermissionStatus(status.state);
        status.onchange = () => {
          setPermissionStatus(status.state);
        };
      });
    }
    setIsLoading(false);
  }, []);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
        {
          headers: { 'User-Agent': 'ReliefGrid-Disaster-Coordination-Platform' },
          signal: controller.signal,
        }
      );
      clearTimeout(id);

      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const c = address.city || address.town || address.village || address.suburb || 'Unknown City';
        const s = address.state || address.region || 'Unknown State';
        const co = address.country || 'Unknown Country';
        const st = address.road || address.pedestrian || address.suburb || 'Central Sector';
        const disp = data.display_name || `${st}, ${c}, ${co}`;
        return { city: c, state: s, country: co, street: st, displayName: disp };
      }
    } catch (e) {
      console.warn('Reverse geocoding timed out or failed. Falling back to coordinates.', e);
    }
    
    // Local geospatial approximation fallback
    if (Math.abs(lat - 6.52) < 0.5 && Math.abs(lon - 3.37) < 0.5) {
      return {
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
        street: 'Broad Street',
        displayName: 'Broad Street, Lagos Island, Lagos, Nigeria',
      };
    }
    if (Math.abs(lat + 1.29) < 0.5 && Math.abs(lon - 36.82) < 0.5) {
      return {
        city: 'Nairobi',
        state: 'Nairobi County',
        country: 'Kenya',
        street: 'Harambee Avenue',
        displayName: 'Harambee Avenue, Nairobi, Kenya',
      };
    }
    return {
      city: `Coord Area (${lat.toFixed(2)})`,
      state: 'Global Region',
      country: 'International',
      street: 'Operational Sector',
      displayName: `Operational Sector, Area (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
    };
  };

  const requestGeolocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const geoInfo = await reverseGeocode(lat, lon);

        setLatitude(lat);
        setLongitude(lon);
        setCity(geoInfo.city);
        setState(geoInfo.state);
        setCountry(geoInfo.country);
        setStreet(geoInfo.street);
        setDisplayName(geoInfo.displayName);
        setSource('gps');
        setPermissionStatus('granted');

        const context = {
          latitude: lat,
          longitude: lon,
          city: geoInfo.city,
          state: geoInfo.state,
          country: geoInfo.country,
          street: geoInfo.street,
          displayName: geoInfo.displayName,
          source: 'gps',
        };
        localStorage.setItem('reliefgrid_operational_location', JSON.stringify(context));
        setIsLoading(false);
      },
      (error) => {
        console.warn('Geolocation access denied or failed.', error);
        setPermissionStatus('denied');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const updateManualLocation = (
    lat: number,
    lon: number,
    c: string,
    s: string,
    co: string,
    st?: string,
    disp?: string
  ) => {
    const finalStreet = st || 'Central Sector';
    const finalDisp = disp || `${finalStreet}, ${c}, ${co}`;

    setLatitude(lat);
    setLongitude(lon);
    setCity(c);
    setState(s);
    setCountry(co);
    setStreet(finalStreet);
    setDisplayName(finalDisp);
    setSource('manual');

    const context = {
      latitude: lat,
      longitude: lon,
      city: c,
      state: s,
      country: co,
      street: finalStreet,
      displayName: finalDisp,
      source: 'manual',
    };
    localStorage.setItem('reliefgrid_operational_location', JSON.stringify(context));
  };

  return (
    <LocationContext.Provider
      value={{
        latitude,
        longitude,
        city,
        state,
        country,
        street,
        displayName,
        source,
        requestGeolocation,
        updateManualLocation,
        isLoading,
        permissionStatus,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
}
