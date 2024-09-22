import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import styles from "../styles/CitySearch.module.css";

function CitySearch({ onCitySearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCitySuggestions = useCallback(async (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await response.json();
      setSuggestions(data.map((city) => `${city.name}, ${city.country}`));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchSuggestions = useCallback(
    debounce((input) => {
      fetchCitySuggestions(input);
    }, 300),
    [fetchCitySuggestions]
  );

  useEffect(() => {
    debouncedFetchSuggestions(searchTerm);
  }, [searchTerm, debouncedFetchSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCitySearch(searchTerm);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onCitySearch(suggestion);
    setSuggestions([]);
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter city name"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
      {isLoading && <p className={styles.loading}>Loading suggestions...</p>}
      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={styles.suggestionItem}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
