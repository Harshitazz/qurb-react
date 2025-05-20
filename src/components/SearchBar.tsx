import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  return (
    <form onSubmit={handleSubmit} className="lg:w-full max-w-2xl mx-auto">
      <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 px-2 sm:px-4 py-4">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search"
          className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
        />
        <button
          type="submit"
          className="absolute right-4 text-gray-500 hover:text-gray-700"
        >
          {/* Replace this with your own search icon or SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 m-1 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 11-10.606-10.607 7.5 7.5 0 0110.606 10.607z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
