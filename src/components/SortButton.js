import React from 'react';

const SortButton = ({ sortOrder, toggleSortOrder }) => {
  return (
    <div className="my-4">
      <button onClick={toggleSortOrder} className="bg-blue-500 text-white p-2 rounded">
        Sort by Price ({sortOrder === 'asc' ? '↑' : '↓'})
      </button>
    </div>
  );
};

export default SortButton;
