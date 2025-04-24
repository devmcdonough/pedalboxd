import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../shared/searchbar/searchbar";
import SearchItem from "../../shared/search-item/search-item";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./search-page.scss";

const SearchPage = () => {
  const location = useLocation();
  const initialQuery = location.state?.query || "";
  const initialBrand  = location.state?.brand   || "";
  const initialType   = location.state?.type    || "";

  const [query, setQuery] = useState(initialQuery);
  const [sortOption] = useState("ratingHighLow");
  const [selectedBrands, setSelectedBrands] = useState(
    initialBrand ? [initialBrand] : []
  );
  const [selectedTypes, setSelectedTypes] = useState(
    initialType ? [initialType] : []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 12;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Fetch when any filter or pagination changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const API = process.env.REACT_APP_API_BASE_URL ||
                    "https://us-central1-pedalboxd.cloudfunctions.net/api";
        const url = new URL(`${API}/search`);
        url.searchParams.set("query", query);
        url.searchParams.set("sort", sortOption);
        url.searchParams.set("brand", selectedBrands.join(","));
        url.searchParams.set("type", selectedTypes.join(","));
        url.searchParams.set("page", String(currentPage));
        url.searchParams.set("limit", String(itemsPerPage));

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Error fetching search results");
        const data = await res.json();
        setTotalResults(data.totalResults);
        setSearchResults(data.results);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, sortOption, selectedBrands, selectedTypes, currentPage]);

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setCurrentPage(1);
    setSelectedBrands(prev =>
      checked ? [...prev, value] : prev.filter(b => b !== value)
    );
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setCurrentPage(1);
    setSelectedTypes(prev =>
      checked ? [...prev, value] : prev.filter(t => t !== value)
    );
  };

  const removeBrand = (brand) => setSelectedBrands(prev => prev.filter(b => b !== brand));
  const removeType  = (type)  => setSelectedTypes(prev => prev.filter(t => t !== type));

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return (
    <div className="search-page">
      <h1>Search Results</h1>
      <div className="search-page__content">
        <aside className="search-page__filters">
          <h3>Filter by:</h3>
          <div className="filter group">
            <h3>Brand</h3>
            {["Strymon","Boss","Wampler","Electro-Harmonix"].map(brand => (
              <label key={brand}>
                <input
                  type="checkbox"
                  value={brand}
                  onChange={handleBrandChange}
                  checked={selectedBrands.includes(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
          <div className="filter group">
            <h3>Pedal Type</h3>
            {["Fuzz","Distortion","Reverb","Delay"].map(type => (
              <label key={type}>
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleTypeChange}
                  checked={selectedTypes.includes(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </aside>

        <div className="search-page__results-container">
          <div className="results-header">
            <div className="search-header-top">
              <SearchBar
                onSearch={q => { setQuery(q); setCurrentPage(1); }}
                onSuggestionSelect={s => { setQuery(s); setCurrentPage(1); }}
              />
              <button className="filter-button" onClick={() => setShowFilterModal(true)}>
                <FilterListIcon />Filter
              </button>
            </div>
            <div className="search-summary">
              <span>{totalResults} results found</span>
            </div>
          </div>

          <div className="selected-filters">
            {query && (
              <div className="filter-pill">
                <span>{query}</span>
                <span onClick={() => setQuery("")}>&times;</span>
              </div>
            )}
            {selectedBrands.map(b => (
              <div key={b} className="filter-pill">
                <span>{b}</span>
                <span onClick={() => removeBrand(b)}>&times;</span>
              </div>
            ))}
            {selectedTypes.map(t => (
              <div key={t} className="filter-pill">
                <span>{t}</span>
                <span onClick={() => removeType(t)}>&times;</span>
              </div>
            ))}
          </div>

          <section className="search-page__results">
            {searchResults.map(item => (
              <SearchItem
                key={item.id}
                id={item.id}
                image={item.Image_URL}
                modelName={item.Model}
                brandName={item.Brand}
                pedalType={item.Type}
                averageRating={item.averageRating}
                ratingCount={item.ratingCount}
              />
            ))}
          </section>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
            className="pagination-link"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >Previous</button>
            <span className="pagination-info">Page {currentPage} of {totalPages}</span>
            <button
              className="pagination-link"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
           >
            Next</button>
          </div>
        </div>
      )}

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {showFilterModal && (
        <div className="filter-modal-overlay">
          <div className="filter-modal">
            <button onClick={() => setShowFilterModal(false)}><CloseIcon /></button>
            <h2>Filters</h2>
            <button onClick={() => setShowFilterModal(false)}>Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
