"use client"

import AddToCart from '@/components/AddToCart'
import Hero from '@/components/Hero'
import { convertDocToObj } from '@/lib/utils'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Category = {
  _id?: string
  name: string
}
 type Product = {
    _id?: string
    name: string
    model: string
    image: string
    price: number
    countInStock: number
    description: string
    category: Category
    rating: number
    onPromotion: boolean
    numReviews: number
    reviews:[]
    createdAt: string
  }

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [promo, setPromo] = useState<Product>()


  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/latest');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      console.log('Fetched products:', data); // Add this line to check the structure of the response
      setProducts(data.products as Product[]); // Make sure 'data.products' is correct
    } catch (error) {
      console.log(error);
    }

  };
  const fetchPromo = async () => {
    try {
      const response = await fetch('/api/promo');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      console.log(data);
      
      console.log('Fetched products:', data); // Add this line to check the structure of the response
      setPromo(data.product as Product); // Make sure 'data.products' is correct
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPromo();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Hero/>
      <h1 className="text-3xl font-bold pl-10 text-yellow-500 my-4 ">
          Check out these latest products
        </h1>
      <div className='flex flex-wrap p-4 gap-7' >
        
      {products?.map((product) => (

        <div key={product._id} className="flex flex-col">
           <div className="p-4 w-[250px] bg-base-300 rounded-xl">
          <div className="h-[150px]">
            <Link href={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} className='w-full  h-[150px] object-cover rounded-xl'/>
            </Link>
            
          </div>

          <div className="w-full flex items-center justify-between my-2">
            <Link href={`/product/${product._id}`}>
              <h1 className=" text-yellow-500 text-xl font-bold">{product.name}</h1>
            </Link>
            <h1 className="text-xl font-bold opacity-50">{product.model}</h1>
          </div>
          <p className="text-sm opacity-60">{product.description.substring(0, 50)}...</p>

          <div className="flex items-center text-lg justify-between my-2">
            <p className="text-lg opacity-70">Price</p>
            <p className="text-sm  bg-yellow-500 p-1 rounded-lg text-slate-950 w-[50px] text-center">$ {product.price}</p>
          </div>

        </div>
        </div>
       
      ))}

    </div>
    <div className="flex flex-col w-full p-10 ">
        {promo &&(
          <div className="flex flex-col w-full bg-base-300 rounded-xl">
            <h1 className="text-3xl text-yellow-500 ml-10 pt-4 ">
              Check out this {promo.name} on promotion
            </h1>
            <div className="w-full p-10 rounded-xl flex flex-col md:flex-row items-center ">
          <img src={promo.image} alt={promo.name} className="w-full md:w-[450px] h-[250px] object-cover rounded-xl" />
            <div className="flex flex-col w-full md:w-[50%] md:ml-[100px]">
            <div className="flex w-full justify-between">
              <h1 className="text-2xl text-yellow-500 opacity-80">
                Name: {promo.name}
              </h1>
              <h1 className="text-lg  opacity-80">
                Category:<span className="text-yellow-500"> {promo.model} </span>
              </h1>
            </div>
            <div className="flex w-full justify-between my-2">
              <h1 className="text-xl text-yellow-500 opacity-80">
                Category: {promo.category.name}
              </h1>
              <h1 className="text-lg  opacity-80">
                In stock: {promo.countInStock}
              </h1>
            </div>
            <div className="flex w-full justify-between my-2">
              <h1 className="text-xl text-yellow-500 opacity-80">
                Price: <span className="underline ">${promo.price}</span>{" "} ${promo.price *80/100}
              </h1>
              <h1 className="text-lg  opacity-80">
                Ratings: {promo.rating}
              </h1>
            </div>
            <p className="text-sm font-light opacity-70">{promo.description}</p>
            <h1 className="text-xl mt-2">Add to cart</h1>
            {promo.countInStock !== 0 && (
                <div className="card-actions w-full ml-[100px] justify-center ">
                  <AddToCart
                    item={{
                      ...convertDocToObj(promo),
                      qty: 0,
                    }}
                  />
                </div>
              )}

          </div>
        </div>
        
      </div>
      )}
    </div>
    
    </div>
    

  )}
