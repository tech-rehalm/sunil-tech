"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

interface Category {
    _id: string;
    name: string;
  }
  
  interface Product {
    _id: string;
    name: string;
    image: string;
    model: string;
    category: Category;
    description: string;
    numReviews: number;
    price: number;
    countInStock: number;
    rating: number
  }

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchProducts();
      }, []);
    
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products');
          const data = await response.json();
          setProducts(data.products as Product[]);
        } catch (error) {
          console.log(error);
          
          toast.error("Failed to fetch products");
        }
      };
  return (
    <div className='w-full min-h-screen p-10'>
      <h1 className="text-3xl text-yellow-500 font-extrabold">All Products</h1>
      <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Categoty</th>
        <th>Model</th>
        <th>Rating</th>
        <th>Reviews</th>
        <th>Description</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      {products?.map((product)=>(
        <tr key={product._id}>
        <th><img src={product.image} className='w-[120px]  rounded-xl h-[65px] object-cover' alt={product.name} /></th>
        <td>{product.name}</td>
        <td>{product.category.name}</td>
        <td>{product.model}</td>
        <td>{product.rating}</td>
        <td>{product.numReviews}</td>
        <td>{product.description}</td>
        <td className='text-yellow-500'>{product.price}</td>
      </tr>
      ))}     
    </tbody>
  </table>
</div>
    </div>
  )
}
