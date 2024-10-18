"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Image, ShoppingBag, Tag, Barcode, Star, MessageSquare, FileText, DollarSign } from 'lucide-react'

interface Category {
  _id: string
  name: string
}

interface Product {
  _id: string
  name: string
  image: string
  model: string
  category: Category
  description: string
  numReviews: number
  price: number
  countInStock: number
  rating: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products as Product[])
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-warning flex items-center">
        <ShoppingBag className="mr-2" />
        All Products
      </h1>
      <div className="card bg-slate-900 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th><Image className="w-4 h-4" /></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Model</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={product.image} alt={product.name} />
                        </div>
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-warning" />
                        {product.category.name}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Barcode className="w-4 h-4 mr-2 text-warning" />
                        {product.model}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-warning" />
                        {product.rating.toFixed(1)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-warning" />
                        {product.numReviews}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-warning" />
                        {product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-warning font-bold">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {product.price.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}