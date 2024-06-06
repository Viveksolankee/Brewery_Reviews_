import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [breweries, setBreweries] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await axios.get(`https://api.openbrewerydb.org/breweries?by_city=${query}`);
    setBreweries(response.data);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <h1>Search</h1>
        <input
          type="text"
          placeholder="Search by city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul className="brewery-list">
        {breweries.map((brewery) => (
          <li key={brewery.id}>
            <Link to={`/brewery/${brewery.id}`}>{brewery.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
