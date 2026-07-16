import requests
import logging
import math
from typing import List, Dict, Any

from app.core.config import settings

logger = logging.getLogger("reliefgrid.gis")

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Returns distance in km
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class GISDataService:
    def __init__(self):
        self.timeout = 2.5 # fail fast for responsiveness

    def fetch_osm_amenities(self, lat: float, lon: float, amenity: str, radius: int = 20000) -> Dict[str, Any]:
        """
        Query OpenStreetMap Overpass API for emergency facilities.
        """
        query = f"""
        [out:json][timeout:3];
        (
          node["amenity"="{amenity}"](around:{radius},{lat},{lon});
          way["amenity"="{amenity}"](around:{radius},{lat},{lon});
        );
        out center;
        """
        try:
            res = requests.post(settings.OVERPASS_URL, data={"data": query}, timeout=self.timeout)
            if res.ok:
                data = res.json()
                elements = data.get("elements", [])
                results = []
                for el in elements:
                    name = el.get("tags", {}).get("name", f"Unnamed {amenity.capitalize()}")
                    el_lat = el.get("lat") or el.get("center", {}).get("lat")
                    el_lon = el.get("lon") or el.get("center", {}).get("lon")
                    if el_lat and el_lon:
                        dist = haversine_distance(lat, lon, el_lat, el_lon)
                        results.append({
                            "name": name,
                            "latitude": el_lat,
                            "longitude": el_lon,
                            "distance_km": round(dist, 2),
                            "amenity": amenity
                        })
                results.sort(key=lambda x: x["distance_km"])
                if not results:
                    logger.warning(f"OSM returned 0 elements for {amenity} at {lat}, {lon}. Triggering simulation fallback.")
                    return {
                        "source": "simulated",
                        "data": self._get_simulated_amenities(lat, lon, amenity)
                    }
                return {
                    "source": "live",
                    "data": results[:10] # limit to top 10 closest
                }
        except Exception as e:
            logger.warning(f"Overpass API query failed for {amenity}: {e}")
            
        # Return structured simulated fallbacks if API is offline or times out
        return {
            "source": "simulated",
            "data": self._get_simulated_amenities(lat, lon, amenity)
        }

    def _get_simulated_amenities(self, lat: float, lon: float, amenity: str) -> List[Dict[str, Any]]:
        # Deterministic simulation based on coordinates so it's consistent
        if amenity == "hospital":
            return [
                {
                    "name": f"St. Jude Emergency Center (Simulated)",
                    "latitude": lat - 0.045,
                    "longitude": lon + 0.035,
                    "distance_km": 5.4,
                    "amenity": "hospital",
                    "capacity_occupancy_percent": 82
                },
                {
                    "name": f"General Hospital West (Simulated)",
                    "latitude": lat + 0.075,
                    "longitude": lon - 0.052,
                    "distance_km": 11.2,
                    "amenity": "hospital",
                    "capacity_occupancy_percent": 68
                }
            ]
        elif amenity == "shelter":
            return [
                {
                    "name": f"Civic Auditorium Evacuation Hub (Simulated)",
                    "latitude": lat - 0.021,
                    "longitude": lon - 0.015,
                    "distance_km": 2.8,
                    "amenity": "shelter",
                    "capacity": 1200,
                    "occupancy": 340
                },
                {
                    "name": f"Westside High School Gymnasium (Simulated)",
                    "latitude": lat + 0.039,
                    "longitude": lon + 0.022,
                    "distance_km": 4.5,
                    "amenity": "shelter",
                    "capacity": 850,
                    "occupancy": 110
                }
            ]
        elif amenity == "police":
            return [
                {
                    "name": f"District 4 Police Station (Simulated)",
                    "latitude": lat + 0.012,
                    "longitude": lon - 0.008,
                    "distance_km": 1.4,
                    "amenity": "police"
                }
            ]
        elif amenity == "fire_station":
            return [
                {
                    "name": f"Metropolitan Fire Station 12 (Simulated)",
                    "latitude": lat - 0.008,
                    "longitude": lon + 0.011,
                    "distance_km": 1.1,
                    "amenity": "fire_station"
                }
            ]
        return []

    def calculate_route(self, lat1: float, lon1: float, lat2: float, lon2: float) -> Dict[str, Any]:
        """
        Calculate route between two coordinates using project-osrm OSRM API.
        """
        url = f"{settings.OSRM_ROUTE_URL}/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson"
        try:
            res = requests.get(url, timeout=self.timeout)
            if res.ok:
                data = res.json()
                routes = data.get("routes", [])
                if routes:
                    route = routes[0]
                    return {
                        "source": "live",
                        "distance_km": round(route.get("distance", 0) / 1000.0, 2),
                        "duration_mins": round(route.get("duration", 0) / 60.0, 1),
                        "geometry": route.get("geometry", {}).get("coordinates", [])
                    }
        except Exception as e:
            logger.warning(f"OSRM Routing failed: {e}")
            
        # Fallback to straight line / simulated path
        dist = haversine_distance(lat1, lon1, lat2, lon2)
        # Generate simple simulated intermediate coordinates
        steps = 5
        coords = []
        for i in range(steps + 1):
            t = i / steps
            coords.append([
                lon1 + t * (lon2 - lon1) + math.sin(t * math.pi) * 0.005,
                lat1 + t * (lat2 - lat1) + math.cos(t * math.pi) * 0.005
            ])
        return {
            "source": "simulated",
            "distance_km": round(dist * 1.25, 2),
            "duration_mins": round(dist * 1.5, 1),
            "geometry": coords
        }

gis_service = GISDataService()
