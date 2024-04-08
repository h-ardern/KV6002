/**
 * Search form component
 *
 * @author Odera Anakpe
 */
import React, { useState } from "react";

function SearchForm(props) {
  const { state } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [filterButtonText, setFilterButtonText] = useState("Filters");

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
    setFilterButtonText((prevState) => {
      const text = prevState === "Filters" ? "Hide Filters" : "Filters";
      return text;
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter search term..."
        value={props.searchTerm}
        onChange={(e) => props.setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex space-x-2 mt-2">
        <button
          onClick={handleFilterClick}
          className="p-2 flex-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          {filterButtonText}
        </button>
      </div>
      {showFilters && (
        <div className="mt-4 space-y-2">
          {props.showUniversity && (
            <input
              type="text"
              placeholder="University"
              value={props.university}
              onChange={(e) => props.setUniversity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {props.showInterest && (
            <input
              type="text"
              placeholder="Interests"
              value={props.interests}
              onChange={(e) => props.setInterests(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {
            <select
              value={props.status}
              onChange={(e) => props.setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Accepting applications">
                Accepting applications
              </option>
              <option value="Not accepting application">
                Not accepting applications
              </option>
              <option value="Closed">Closed</option>
            </select>
          }
        </div>
      )}
    </div>
  );
}

export default SearchForm;
