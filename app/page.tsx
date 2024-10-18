"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { convertDocToObj } from '@/lib/utils'
import AddToCart from '@/components/AddToCart'
import { Star, ShoppingBag, TrendingUp, Tag, Box, Truck, Clock, ArrowRight } from 'lucide-react'

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
  reviews: []
  createdAt: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [promo, setPromo] = useState<Product>()

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/latest')
      if (!response.ok) console.log('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products as Product[])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPromo = async () => {
    try {
      const response = await fetch('/api/promo')
      if (!response.ok) console.log('Failed to fetch promo product')
      const data = await response.json()
      setPromo(data.product as Product)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchPromo()
    fetchProducts()
    fetchPromo()
    fetchProducts()
    fetchPromo()
  }, [])
  console.log(products);
  console.log(promo);
  

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="hero h-[70vh] md:h-screen" style={{backgroundImage: 'url(/bg.png'}}>
        <div className="hero-overlay bg-opacity-80"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to Sunil Tech Store</h1>
            <p className="mb-5">Discover the latest in technology and gadgets. From smartphones to smart home devices, we've got you covered.</p>
            <Link href="/shop" className="btn btn-warning">Shop Now <ShoppingBag className="ml-2" /></Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-800 w-full py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-slate-900 shadow-xl">
              <div className="card-body items-center text-center">
                <Truck className="w-12 h-12 text-warning mb-4" />
                <h3 className="card-title">Free Shipping</h3>
                <p>On orders over $100</p>
              </div>
            </div>
            <div className="card bg-slate-900 shadow-xl">
              <div className="card-body items-center text-center">
                <Clock className="w-12 h-12 text-warning mb-4" />
                <h3 className="card-title">24/7 Support</h3>
                <p>Always here to help</p>
              </div>
            </div>
            <div className="card bg-slate-900 shadow-xl">
              <div className="card-body items-center text-center">
                <Box className="w-12 h-12 text-warning mb-4" />
                <h3 className="card-title">Easy Returns</h3>
                <p>30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Products Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div key={product._id} className="card bg-slate-900 shadow-xl">
              <figure><img src={product.image} alt={product.name} className="h-48 w-full object-cover" /></figure>
              <div className="card-body">
                <h2 className="card-title text-warning">{product.name}</h2>
                <p className="text-sm opacity-70">{product.description.substring(0, 50)}...</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">${product.price}</span>
                  <div className="badge badge-outline">{product.model}</div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link href={`/product/${product._id}`} className="btn btn-warning btn-sm">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Product Section */}
      {promo && (
        <div className="bg-state-800 w-full py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Special Offer</h2>
            <div className="card lg:card-side bg-slate-900 shadow-xl">
              <figure className="lg:w-1/2"><img src={promo.image} alt={promo.name} className="h-full w-full object-cover" /></figure>
              <div className="card-body lg:w-1/2">
                <h2 className="card-title text-warning text-3xl">{promo.name}</h2>
                <p className="text-lg">{promo.description}</p>
                <div className="flex flex-wrap gap-4 my-4">
                  <div className="badge badge-warning gap-2">
                    <Tag className="w-4 h-4" />
                    {promo.category.name}
                  </div>
                  <div className="badge badge-outline gap-2">
                    <Box className="w-4 h-4" />
                    {promo.model}
                  </div>
                  <div className="badge badge-outline gap-2">
                    <Star className="w-4 h-4" />
                    {promo.rating} ({promo.numReviews} reviews)
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="md:text-3xl font-bold text-warning">${(promo.price * 0.8).toFixed(2)}</span>
                  <span className="md:text-xl line-through opacity-50">${promo.price.toFixed(2)}</span>
                  <span className="badge badge-error">20% OFF</span>
                </div>
                <div className="card-actions justify-end mt-6">
                  {promo.countInStock > 0 ? (
                    <AddToCart
                      item={{
                        ...convertDocToObj(promo),
                        qty: 0,
                      }}
                    />
                  ) : (
                    <button className="btn btn-disabled">Out of Stock</button>
                  )}
                  <Link href={`/product/${promo._id}`} className="btn btn-outline btn-warning">
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-warning text-warning-content w-full py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Upgrade Your Tech?</h2>
          <p className="mb-8 text-lg">Explore our wide range of products and find the perfect device for you.</p>
          <Link href="/shop" className="btn btn-outline btn-lg text-base-300">
            Browse All Products
            <TrendingUp className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}