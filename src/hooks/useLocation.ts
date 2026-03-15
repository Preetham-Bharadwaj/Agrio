import { useState } from 'react';

interface LocationData {
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface SearchResult {
  display: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Get GPS coordinates
  const detectLocation = async () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await reverseGeocode(latitude, longitude);
      },
      (err) => {
        setError('Location denied — Please enable location access in your browser settings');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Step 2: Convert coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Try multiple free APIs for better reliability
      let locationData: LocationData | null = null;
      
      // Approach 1: Try Overpass API (most reliable for OpenStreetMap data)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        // Build Overpass QL query to find nearest address data
        const bbox = `${lat - 0.001},${lng - 0.001},${lat + 0.001},${lng + 0.001}`;
        const overpassQuery = `
          [out:json][timeout:25];
          (
            way["highway"]["name"](${bbox});
            node["place"="city"](${bbox});
            node["place"="town"](${bbox});
            node["place"="village"](${bbox});
            relation["boundary"="administrative"]["admin_level"~"4|6|8"](${bbox});
          );
          out tags;
        `;
        
        const res = await fetch(
          'https://overpass-api.de/api/interpreter',
          { 
            method: 'POST',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            body: `data=${encodeURIComponent(overpassQuery)}`,
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.elements && data.elements.length > 0) {
            // Extract location information from Overpass data
            const elements = data.elements;
            
            let street = '';
            let city = '';
            let district = '';
            let state = '';
            
            // Find street name
            const streetElement = elements.find((el: any) => el.tags && el.tags.highway && el.tags.name);
            if (streetElement) {
              street = streetElement.tags.name;
            }
            
            // Find city/town/village
            const cityElement = elements.find((el: any) => 
              el.tags && (el.tags.place === 'city' || el.tags.place === 'town' || el.tags.place === 'village') && el.tags.name
            );
            if (cityElement) {
              city = cityElement.tags.name;
            }
            
            // Find administrative boundaries
            const stateElement = elements.find((el: any) => 
              el.tags && el.tags.boundary === 'administrative' && 
              el.tags.admin_level === '4' && el.tags.name
            );
            if (stateElement) {
              state = stateElement.tags.name;
            }
            
            const districtElement = elements.find((el: any) => 
              el.tags && el.tags.boundary === 'administrative' && 
              el.tags.admin_level === '6' && el.tags.name
            );
            if (districtElement) {
              district = districtElement.tags.name;
            }
            
            locationData = {
              street: street || 'Nearby Location',
              city: city || 'Unknown City',
              district: district || 'Unknown District',
              state: state || 'Unknown State',
              pincode: '000000'
            };
          }
        }
      } catch (err) {
        console.log('Overpass API failed:', err);
      }

      // Approach 2: Try BigDataCloud API as backup
      if (!locationData) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
            { 
              headers: { 
                'Accept': 'application/json'
              }
            }
          );
          
          if (res.ok) {
            const data = await res.json();
            if (data && data.status === 'OK') {
              locationData = {
                street: data.streetName || data.locality || '',
                city: data.city || data.locality || '',
                district: data.county || data.sublocality || '',
                state: data.principalSubdivision || '',
                pincode: data.postcode || ''
              };
            }
          }
        } catch (err) {
          console.log('BigDataCloud API failed:', err);
        }
      }

      // Approach 3: Try Nominatim as last resort
      if (!locationData) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
            { 
              headers: { 
                'User-Agent': 'AgrioApp/1.0 (contact@agrio.com)',
                'Accept': 'application/json'
              }
            }
          );
          
          if (res.ok) {
            const data = await res.json();
            if (!data.error) {
              locationData = {
                street: data.address.road || data.address.footway || data.address.residential || '',
                city: data.address.city || data.address.town || data.address.village || '',
                district: data.address.state_district || data.address.county || '',
                state: data.address.state || '',
                pincode: data.address.postcode || ''
              };
            }
          }
        } catch (err) {
          console.log('Nominatim backup failed:', err);
        }
      }

      // If we got location data, use it
      if (locationData) {
        setLocation(locationData);
        setError(null);
        setLoading(false);
        return;
      }

      // If all APIs failed, use coordinates fallback
      console.log('All APIs failed, using coordinate fallback');
      const fallbackLocation: LocationData = {
        street: `GPS Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        city: 'Your City',
        district: 'Your District',
        state: 'Your State', 
        pincode: '000000'
      };
      
      setLocation(fallbackLocation);
      setError(`GPS detected but address lookup failed. Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}. Please edit your address.`);
      
      setLoading(false);
      setTimeout(() => setError(''), 5000);

    } catch (err: any) {
      console.error('Unexpected error in geocoding:', err);
      
      // Final fallback with coordinates for any unexpected errors
      const fallbackLocation: LocationData = {
        street: `GPS Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        city: 'Your City',
        district: 'Your District',
        state: 'Your State', 
        pincode: '000000'
      };
      
      setLocation(fallbackLocation);
      setError(`GPS detected but address lookup failed. Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}. Please edit your address.`);
      
      setLoading(false);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Step 3: Search address manually
  const searchAddress = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    try {
      // Add delay to respect rate limiting (1 request/second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&addressdetails=1&limit=5`,
        { 
          headers: { 'User-Agent': 'AgrioApp/1.0' },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const results = await res.json();
      
      if (!Array.isArray(results)) {
        throw new Error('Invalid response format');
      }
      
      return results.map((r: any) => ({
        display: r.display_name,
        street: r.address.road || r.address.footway || r.address.residential || '',
        city: r.address.city || r.address.town || r.address.village || '',
        district: r.address.state_district || r.address.county || '',
        state: r.address.state || '',
        pincode: r.address.postcode || ''
      }));
    } catch (err: any) {
      console.error('Address search error:', err);
      
      // If it's a network error or timeout, provide a helpful message
      if (err.name === 'AbortError') {
        throw new Error('Search request timed out. Please try again.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        throw new Error(err.message || 'Failed to search addresses');
      }
    }
  };

  // Step 4: Update location manually (for edited inputs)
  const updateLocation = (locationData: LocationData) => {
    setLocation(locationData);
    setError(null);
  };

  // Step 5: Clear location
  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  return { 
    location, 
    loading, 
    error, 
    detectLocation, 
    searchAddress, 
    updateLocation,
    clearLocation
  };
}
