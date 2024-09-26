"use client";

import Product from '@/components/Product';
import React, { useEffect, useState } from 'react';

type Category = {
  _id?: string;
  name: string;
};
type Product = {
  _id?: string;
  name: string;
  model: string;
  image: string;
  price: number;
  countInStock: number;
  description: string;
  category: Category;
  rating: number;
  onPromotion: boolean;
  numReviews: number;
  reviews: [];
  createdAt: string;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // New state for filtered products
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // State for selected category
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products as Product[]);
      setFilteredProducts(data.products as Product[]); // Initially set filtered products to all products
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories as Category[]);
    } catch (error) {
      console.log(error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== '') {
      filtered = filtered.filter(product => product.category.name === selectedCategory);
    }

    // Apply search filter
    if (searchQuery !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const filterByCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts(); // Re-apply filters whenever category or search query changes
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className='w-full min-h-screen'>
      <div className="flex items-center justify-between p-10 px-[150px]">
        <h1 className="text-2xl font-bold text-yellow-500">Get your device now</h1>
        <input
          type="text"
          placeholder="Search "
          value={searchQuery}
          onChange={handleSearch}
          className="input input-bordered input-warning w-full max-w-xs"
        />
      </div>

      <div className="fixed left-0 top-0 bottom-0 w-[120px] bg-slate-700 flex flex-col items-center justify-center p-4">
        <button
          className={`w-full p-3 text-yellow-500 transition duration-500 hover:bg-yellow-500 hover:text-slate-950 rounded-xl ${
            selectedCategory === '' ? 'bg-base-300 text-slate-950' : ''
          }`}
          onClick={() => filterByCategory('')}
        >
          All
        </button>
        {categories?.map((category) => (
          <button
            key={category._id}
            className={`w-full p-3 text-yellow-500 transition duration-500 hover:bg-yellow-500 hover:text-slate-950 rounded-xl ${
              selectedCategory === category.name ? 'bg-base-300 text-slate-950' : ''
            }`}
            onClick={() => filterByCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="ml-[130px] flex flex-wrap p-10 gap-5 md:gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
