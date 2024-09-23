import React, { useState, useEffect } from 'react';

const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  categories,
}) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  useEffect(() => {
    const uniqueMainCategories = [
      ...new Set(categories.map((cat) => cat.main_category)),
    ];
    setMainCategories(uniqueMainCategories);
  }, [categories]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setSubCategories([]);
      setSubSubCategories([]);
    } else {
      const subCats = [
        ...new Set(
          categories
            .filter((cat) => cat.main_category === selectedCategory)
            .map((cat) => cat.category_level_1)
            .filter(Boolean) 
        ),
      ];
      setSubCategories(subCats);
      setSelectedSubCategory(""); 
      setSubSubCategories([]); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, categories]);

  useEffect(() => {
    if (selectedSubCategory) {
      const subSubCats = [
        ...new Set(
          categories
            .filter(
              (cat) =>
                cat.main_category === selectedCategory &&
                cat.category_level_1 === selectedSubCategory
            )
            .map((cat) => cat.category_level_2)
            .filter(Boolean) 
        ),
      ];
      setSubSubCategories(subSubCats);
    } else {
      setSubSubCategories([]);
    }
  }, [selectedSubCategory, selectedCategory, categories]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSubCategory("");
  };

  return (
    <div className="my-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Category Filter</h2>

      <button 
        onClick={resetFilters}
        className="border p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Reset Filters
      </button>

      <div className="hidden md:block">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        {mainCategories.map((mainCategory, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={selectedCategory === mainCategory}
                onChange={() => {
                  setSelectedCategory(mainCategory);
                  setSelectedSubCategory(""); 
                }}
              />
              {mainCategory}
            </label>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubCategory(""); 
          }}
          className="border p-2 w-full rounded"
        >
          <option value="All">All Categories</option>
          {mainCategories.map((mainCategory, index) => (
            <option key={index} value={mainCategory}>
              {mainCategory}
            </option>
          ))}
        </select>
      </div>

      {subCategories.length > 0 && (
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold mb-2">Subcategories</h3>
          {subCategories.map((subCategory, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedSubCategory === subCategory}
                  onChange={() => {
                    setSelectedSubCategory(subCategory);
                    const subSubCats = [
                      ...new Set(
                        categories
                          .filter(
                            (cat) =>
                              cat.main_category === selectedCategory &&
                              cat.category_level_1 === subCategory
                          )
                          .map((cat) => cat.category_level_2)
                          .filter(Boolean)
                      ),
                    ];
                    setSubSubCategories(subSubCats);
                  }}
                />
                {subCategory}
              </label>
            </div>
          ))}
        </div>
      )}

      {subCategories.length > 0 && (
        <div className="md:hidden">
          <select
            value={selectedSubCategory}
            onChange={(e) => {
              setSelectedSubCategory(e.target.value);
              const subSubCats = [
                ...new Set(
                  categories
                    .filter(
                      (cat) =>
                        cat.main_category === selectedCategory &&
                        cat.category_level_1 === e.target.value
                    )
                    .map((cat) => cat.category_level_2)
                    .filter(Boolean)
                ),
              ];
              setSubSubCategories(subSubCats);
            }}
            className="border p-2 w-full rounded"
          >
            <option value="">All Subcategories</option>
            {subCategories.map((subCategory, index) => (
              <option key={index} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>
      )}

      {subSubCategories.length > 0 && (
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold mb-2">Sub-subcategories</h3>
          {subSubCategories.map((subSubCategory, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => console.log(`Selected sub-subcategory: ${e.target.value}`)}
                />
                {subSubCategory}
              </label>
            </div>
          ))}
        </div>
      )}
      {subSubCategories.length > 0 && (
        <div className="md:hidden">
          <select
            className="border p-2 w-full rounded"
            onChange={(e) => console.log(`Selected sub-subcategory: ${e.target.value}`)}
          >
            <option value="">All Sub-subcategories</option>
            {subSubCategories.map((subSubCategory, index) => (
              <option key={index} value={subSubCategory}>
                {subSubCategory}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
