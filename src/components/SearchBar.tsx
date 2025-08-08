import React, { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, AlertCircle, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { searchApi } from "@/lib/api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Handle search suggestions
  useEffect(() => {
    if (query.length > 2) {
      const delaySearch = setTimeout(async () => {
        try {
          setIsLoading(true);
          const results = await searchApi.searchProducts(query, 5);
          setSuggestions(results);
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
      return () => clearTimeout(delaySearch);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchTerm = query) => {
    if (!searchTerm.trim()) return;

    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }

    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyPress}
          placeholder="ابحث عن المنتجات..."
          className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-xl 
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 
                     bg-gray-50 focus:bg-white shadow-sm transition-all duration-200
                     text-gray-900 placeholder-gray-500 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 
                       rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              <span className="text-gray-500 text-xs mt-2 block">
                جاري البحث...
              </span>
            </div>
          )}

          {/* Search Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <TrendingUp className="h-3 w-3 mr-1" />
                اقتراحات
              </div>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  state={{ product }}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center px-2 py-2 hover:bg-gray-50 rounded-lg
                           text-right transition-colors duration-150 group"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-8 h-8 rounded-lg object-cover ml-2 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      {product.price} ريال
                    </p>
                  </div>
                  <Search className="h-3 w-3 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}

              {/* Show All Results Button */}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={() => handleSearch()}
                  className="w-full flex items-center justify-center px-2 py-2 hover:bg-green-50 rounded-lg
                           text-center transition-colors duration-150 text-green-600 hover:text-green-700 font-medium text-xs"
                >
                  <Search className="h-3 w-3 ml-1" />
                  عرض جميع النتائج لـ "{query}"
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length > 2 && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs mb-2">لا توجد نتائج</p>
              <button
                onClick={() => handleSearch()}
                className="px-3 py-1 text-green-600 hover:text-green-700 text-xs font-medium
                         bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-150"
              >
                البحث عن "{query}"
              </button>
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && query.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <SearchIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">ابدأ الكتابة للبحث عن المنتجات</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
