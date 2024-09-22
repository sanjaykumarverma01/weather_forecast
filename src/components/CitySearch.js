import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import styles from "../styles/CitySearch.module.css";

const preDefineCities = ["Mumbai", "Delhi", "Lucknow", "Pune", "Nashik"];

function CitySearch({ onCitySearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState(preDefineCities);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCitySuggestions = useCallback(async (input) => {
    if (input.length < 2) {
      setSuggestions(preDefineCities);
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
      setSuggestions(preDefineCities); // Revert to preloaded cities on error
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
    if (searchTerm.trim()) {
      debouncedFetchSuggestions(searchTerm);
    } else {
      setSuggestions(preDefineCities);
    }
  }, [searchTerm, debouncedFetchSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCitySearch(searchTerm);
      setIsModalOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onCitySearch(suggestion);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        value={searchTerm}
        onClick={() => setIsModalOpen(true)}
        placeholder="Select a city"
        readOnly
        className={styles.searchInput}
      />

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a city"
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </form>

            {isLoading && (
              <p className={styles.loading}>Loading suggestions...</p>
            )}

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

          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default CitySearch;
