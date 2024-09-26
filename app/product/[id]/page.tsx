"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams from next/navigation
import AddToCart from "@/components/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import { useSession } from 'next-auth/react';
import Rev from "@/components/Review";

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
}

type Product = {
  _id: string;
  name: string;
  model: string;
  image: string;
  price: number;
  countInStock: number;
  description: string;
  category: { _id: string; name: string };
  rating: number;
  numReviews: number;
  createdAt: string;
  reviews: Review[]
};

export default function ProductPage() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {data: session} = useSession()
  const [disabled, setDisabled] = useState(false)

  const setDisabledState = async()=>{
    const reviewed = product?.reviews.find((review)=>{
      review.name === session?.user.firstname
    })
    if(reviewed){
      setDisabled(true)
    }
  }


  const fetchProduct = async () => {
    if (!id) return; // Wait for `id` to be available
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data.product); // Set the fetched product data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchProduct(); // Fetch product details when ID is available
    }
    setDisabledState()
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex flex-col md:flex-row w-full">
        {/* Product Image */}
        <div className="w-full md:w-1/2 flex justify-center ">
          <img src={product.image} alt={product.name} className="w-[500px] h-[500px] object-cover rounded-xl" />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-[50%] p-4 md:ml-[200px] ">
          <h1 className="text-4xl font-bold">Name: <span className="text-yellow-500">{product.name}</span></h1>
          <p className="text-2xl">Model: <span className="text-yellow-500">{product.model}</span></p>
          <p className="text-lg">Category: <span className="text-yellow-500">{product.category.name}</span></p>
          <p className="text-2xl font-semibold my-6">Price: ${product.price}</p>
          <p className="text-xl">Count In Stock: <span className="text-yellow-500">{product.countInStock}</span></p>
          <p className="mt-4 text-xl"><span className="text-yellow-500">{product.description}</span></p>

          <div className="mt-6 flex w-full">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Rating:</span> <span className="text-yellow-500">{product.rating}</span>
            <p>{product.numReviews} Reviews</p>
            </div>
            <div className="my-5">
          {product.countInStock !== 0 && (
                <div className="card-actions w-full ml-[100px] justify-center ">
                  <AddToCart
                    item={{
                      ...convertDocToObj(product),
                      qty: 0,
                    }}
                  />
                </div>
              )}
        </div>
          </div>
          <p className="text-sm text-yellow-500 my-3">{product.description}</p>
        </div>
      </div>
      <Rev product={product} setProduct={setProduct} session={session} disabled={disabled}/>
      <span className="divider"></span>
      
      <div className='w-full flex flex-col'>
          <h2 className='my-2 text-2xl font-extrabold bg-gradient-to-bl rounded-xl from-[aqua] to-[lime] bg-clip-text text-transparent'>Reviews</h2> <br />
          {product.reviews.length === 0 ? (
            <p className="text-3xl my-4">No reviews yet.</p>
          ) : (
            <ul className='w-full flex flex-col'>
              <h1 className="text-3xl my-3 font-bold text-yellow-500 opacity-75">Latest Product reviews</h1>
              <div className="flex flex-col md:flex-row">
                {product.reviews.map((review: Review) => (
                <li key={review._id} className='w-[300px] flex flex-col p-3 rounded-xl shadow-md shadow-yellow-500 m-4 font-bold'>
                  <strong className="text-2xl font-bold opacity-50 my-2 text-yellow-500">{review.name}</strong>
                  <p className="text-sm font-light opacity-75">{review.comment}</p>
                  <p>Ratings: <span className="text-[lime]">{review.rating}</span> </p>
                </li>
              ))}
              </div>
              
            </ul>
          )}
        </div>
    </div>
  );
}
