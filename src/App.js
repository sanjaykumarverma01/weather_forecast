import React, { useState, lazy, Suspense } from "react";
import WeatherDisplay from "./components/WeatherDisplay";
import CitySearch from "./components/CitySearch";
import TemperatureToggle from "./components/TemperatureToggle";
import styles from "./styles/App.module.css";
import useWeatherAPI from "./hooks/useWeatherAPI";

const FiveDayForecast = lazy(() => import("./components/FiveDayForecast"));

function App() {
  const { setCity, weatherData, forecast, error } = useWeatherAPI("New York");
  const [tempUnit, setTempUnit] = useState("C");

  const handleCitySearch = (cityName) => {
    setCity(cityName);
  };

  const toggleTempUnit = () => {
    setTempUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <CitySearch onCitySearch={handleCitySearch} />
        <TemperatureToggle unit={tempUnit} onToggle={toggleTempUnit} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {weatherData && (
        <WeatherDisplay weatherData={weatherData} tempUnit={tempUnit} />
      )}
      {forecast.length > 0 && (
        <Suspense fallback={<div>Loading forecast...</div>}>
          <FiveDayForecast forecast={forecast} tempUnit={tempUnit} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
