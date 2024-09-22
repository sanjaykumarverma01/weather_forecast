import React from "react";
import styles from '../styles/WeatherDisplay.module.css';

function WeatherDisplay({ weatherData, tempUnit }) {
  const { name, main, weather } = weatherData;
  const temperature = tempUnit === 'C' ? main.temp : (main.temp * 9/5) + 32;

  return (
    <div className={styles.weatherDisplay}>
      <h2>{name}</h2>
      <p className={styles.temperature}>{Math.round(temperature)}°{tempUnit}</p>
      <p className={styles.condition}>{weather[0].main}</p>
      <img 
        src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} 
        alt={weather[0].description} 
        className={styles.weatherIcon}
      />
    </div>
  );
}

export default WeatherDisplay;
