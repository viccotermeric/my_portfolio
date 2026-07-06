import { useEffect, useState } from 'react';

export function useIpWeather() {
  const [weatherText, setWeatherText] = useState('--°C');

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      try {
        // Fetch location details safely using geojs.io which is highly permissive with CORS
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!geoRes.ok) throw new Error('Location fetch failed');
        const geoData = await geoRes.json();
        const lat = geoData.latitude;
        const lon = geoData.longitude;
        const city = geoData.city || '';

        if (!lat || !lon) throw new Error('Invalid coordinates');

        // Fetch weather in Celsius (default for open-meteo)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=fahrenheit`
        );
        if (!weatherRes.ok) throw new Error('Weather fetch failed');
        
        const weatherData = await weatherRes.json();
        const temperature = weatherData?.current?.temperature_2m;
        
        if (typeof temperature !== 'number') throw new Error('No temperature data');

        if (!cancelled) {
          setWeatherText(`${city ? city + ', ' : ''}${Math.round(temperature)}°F`);
        }
      } catch (error) {
        console.warn('Weather fetching dynamically failed:', error);
        if (!cancelled) {
          setWeatherText('79°F'); // Safe fallback if adblockers block IP fetches
        }
      }
    };

    void loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  return weatherText;
}
