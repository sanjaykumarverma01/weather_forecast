import React from 'react';
import ForecastCard from './ForecastCard';
import styles from '../styles/App.module.css';

function FiveDayForecast({ forecast, tempUnit }) {
  return (
    <div className={styles.fiveDayForecast}>
      {forecast.map((day, index) => (
        <ForecastCard key={index} day={day} tempUnit={tempUnit} />
      ))}
    </div>
  );
}

export default FiveDayForecast;
