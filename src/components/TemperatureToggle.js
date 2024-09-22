import React from "react";
import styles from '../styles/App.module.css';

function TemperatureToggle({ unit, onToggle }) {
  return (
    <button onClick={onToggle} className={styles.tempToggle}>
      Switch to {unit === 'C' ? '°F' : '°C'}
    </button>
  );
}

export default TemperatureToggle;
