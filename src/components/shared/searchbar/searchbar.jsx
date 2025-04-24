import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import SearchIcon from '@mui/icons-material/Search';
import './searchbar.scss';

const SearchBar = ({ onSearch, onSuggestionSelect }) => {
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('ratingHighLow');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5001/pedalboxd/us-central1/api";

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      try {
        const endpoint = `${API_BASE_URL}/suggestions?query=${encodeURIComponent(q)}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Error fetching suggestions");
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Suggestion error", error);
        setSuggestions([]);
      }
    }, 300),
    [API_BASE_URL]
  );

  const handleInputChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim()) {
      fetchSuggestions(q);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    navigate("/search", { state: { query: query } });
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    navigate("/search", { state: { query: suggestion } });
    onSuggestionSelect(suggestion);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search pedals by brand, type or model"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button">
          <SearchIcon />
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((sugg, index) => (
            <li key={index} onClick={() => handleSuggestionClick(sugg)}>
              {sugg}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
