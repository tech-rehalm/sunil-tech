"use client"

import React, { useEffect, useState } from 'react'
import { Search, ShoppingCart, Star, Filter } from 'lucide-react'
import AddToCart from '@/components/AddToCart'
import { convertDocToObj } from '@/lib/utils'
import Link from 'next/link'

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

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products as Product[])
      setFilteredProducts(data.products as Product[])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data.categories as Category[])
    } catch (error) {
      console.log(error)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== '') {
      filtered = filtered.filter(product => product.category.name === selectedCategory)
    }

    if (searchQuery !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const filterByCategory = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setIsFilterOpen(false)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [selectedCategory, searchQuery, products])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-warning mb-4 md:mb-0">Get your device now</h1>
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={handleSearch}
              className="input input-bordered input-warning w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warning" />
          </div>
          <button
            className="btn btn-warning ml-2 md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className={`md:w-1/4 md:pr-4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-base-200 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                className={`btn btn-sm w-full ${selectedCategory === '' ? 'btn-warning' : 'btn-ghost'}`}
                onClick={() => filterByCategory('')}
              >
                All
              </button>
              {categories?.map((category) => (
                <button
                  key={category._id}
                  className={`btn btn-sm w-full ${selectedCategory === category.name ? 'btn-warning' : 'btn-ghost'}`}
                  onClick={() => filterByCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-lg">No products found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <Link href={`/product/${product._id}`} className="px-4 pt-4">
        <img src={product.image} alt={product.name} className="rounded-xl object-cover h-48 w-full" />
      </Link>
      <div className="card-body">
        <h2 className="card-title text-warning">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.model}</p>
        <div className="flex items-center mt-2">
          <Star className="w-4 h-4 text-warning mr-1" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500 ml-2">({product.numReviews} reviews)</span>
        </div>
        <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
        <div className="card-actions justify-end mt-4">
          <AddToCart
                      item={{
                        ...convertDocToObj(product),
                        qty: 0,
                      }}
                    />
        </div>
      </div>
      {product.onPromotion && (
        <div className="absolute top-2 right-2 bg-warning text-warning-content text-xs font-bold px-2 py-1 rounded">
          On Promotion
        </div>
      )}
    </div>
  )
}