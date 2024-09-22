import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

const useWeatherAPI = (initialCity) => {
  const [city, setCity] = useState(initialCity);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeatherData = useCallback(
    async (cityName) => {
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
          ),
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
          throw new Error("City not found");
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        const filteredForecast = forecastData.list.filter((forecast) => {
          const hour = new Date(forecast.dt * 1000).getHours();
          return (
            hour === 2 || hour === 5 || hour === 8 || hour === 11 || hour === 14
          );
        });

        setWeatherData(weatherData);
        setForecast(filteredForecast);
        setError(null);
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
        setForecast([]);
      }
    },
    [apiKey]
  );

  const debouncedFetchWeatherData = useCallback(
    debounce((cityName) => {
      fetchWeatherData(cityName);
    }, 300),
    [fetchWeatherData]
  );

  useEffect(() => {
    debouncedFetchWeatherData(city);
  }, [city, debouncedFetchWeatherData]);

  return { city, setCity, weatherData, forecast, error };
};

export default useWeatherAPI;
