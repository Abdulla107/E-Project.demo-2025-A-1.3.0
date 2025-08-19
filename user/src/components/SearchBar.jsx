import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = ({ setSearchValue }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    
    if(pathname !== '/shop'){
      navigate('/shop')
    }
    const value = e.target.value;
    setInputValue(value);
    setSearchValue(value);
    
  };

  return (
    <div className="flex w-full lg:mx-14 max-w-4xl border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-blue-600 bg-white shadow-sm transition-all">
      {/* Search Input */}
      <input
        onChange={handleChange}
        value={inputValue}
        type="text"
        placeholder="Search for products, brands and more"
        className="flex-1 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
      {/* Optional: search icon */}
      <div className="flex items-center px-3 text-gray-500">
        <FaSearch />
      </div>
    </div>
  );
};

export default SearchBar;
