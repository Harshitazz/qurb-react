import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const categories: Category[] = [
    { id: 'all', name: 'All items' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'fruit', name: 'Fruit' },
    { id: 'bakery', name: 'Bakery' },
  ];

  return (
    <div className="flex gap-3 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`sm:px-5 px-2 py-2 rounded-full border transition font-almarai shadow-xl
            ${
              selectedCategory === category.id
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-white text-gray-500 border-gray-300 hover:text-gray-700 hover:border-gray-400'
            }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
