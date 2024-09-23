import React from 'react';

const SearchFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="my-4">
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full rounded"
      />
    </div>
  );
};

export default SearchFilter;
