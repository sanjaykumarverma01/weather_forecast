import React from "react";
import styles from "../styles/ForecastCard.module.css";

function ForecastCard({ day, tempUnit }) {
  const { dt, main, weather } = day;
  const date = new Date(dt * 1000);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

  const convertTemp = (temp) => {
    return tempUnit === "C" ? temp : (temp * 9) / 5 + 32;
  };

  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const time = date.toLocaleString("en-US", options);

  return (
    <div className={styles.forecastCard}>
      <h3>{dayName}</h3>
      <img
        src={`http://openweathermap.org/img/wn/${weather[0].icon}.png`}
        alt={weather[0].description}
      />
      <h4>{time}</h4>
      <p>
        High: {Math.round(convertTemp(main.temp_max))}°{tempUnit}
      </p>
      <p>
        Low: {Math.round(convertTemp(main.temp_min))}°{tempUnit}
      </p>
    </div>
  );
}

export default ForecastCard;
