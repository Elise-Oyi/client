"use client";

import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

type SearchProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
};

const Search: React.FC<SearchProps> = ({
  placeholder = `Search...`,
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-md relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
        <SearchIcon className="w-5 h-5" />
      </span>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-1 border  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Search;
