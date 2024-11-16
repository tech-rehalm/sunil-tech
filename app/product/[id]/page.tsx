"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react'
import { convertDocToObj } from "@/lib/utils"
import AddToCart from "@/components/AddToCart"

export interface Review {
  _id: string
  name: string
  rating: number
  comment: string
  user: string
}

export interface Category {
  _id: string
  name: string
}

export interface Product {
  _id: string
  name: string
  image: string
  model: string
  category: Category
  description: string
  reviews: Review[]
  rating: number
  numReviews: number
  price: number
  countInStock: number
  createdAt: string
}

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const [disabled, setDisabled] = useState(false)
  const [review, setReview] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)

  const fetchProduct = async () => {
    if (!id) return
    try {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch product")
      }
      const data = await response.json()
      setProduct(data.product)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching product:", err)
      setError(err instanceof Error ? err.message : String(err))
      setLoading(false)
    }
  }

  const setDisabledState = () => {
    if (!product || !session) return
    const reviewed = product.reviews.find((review) => review.name === session.user.firstname)
    if (reviewed) {
      setDisabled(true)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    setDisabledState()
  }, [product, session])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error('You need to be logged in to submit a review.')
      return
    }

    if (!product) return

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviews: [
            ...product.reviews,
            {
              name: session.user.firstname,
              rating,
              comment: review,
              user: session.user._id,
            },
          ],
          numReviews: product.numReviews + 1,
          rating: ((product.rating * product.numReviews) + rating) / (product.numReviews + 1),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setProduct(data.product)
        setReview('')
        setRating(0)
        toast.success("Review added successfully")
      } else {
        toast.error("Failed to submit review: " + data.error)
      }
    } catch (error) {
      toast.error("An error occurred while submitting the review")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-warning"></span>
    </div>
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>
  }

  if (!product) {
    return <div className="alert alert-info">Product not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-xl shadow-lg" />
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold text-warning">{product.name}</h1>
          <p className="text-xl">Model: <span className="text-warning">{product.model}</span></p>
          <p className="text-lg">Category: <span className="badge badge-warning">{product.category.name}</span></p>
          <p className="text-2xl font-semibold">Price: <span className="text-warning">${product.price.toFixed(2)}</span></p>
          <p className="text-lg">In Stock: <span className="text-warning">{product.countInStock}</span></p>
          <p className="text-gray-400">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= product.rating ? 'text-warning fill-warning' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-gray-600">({product.numReviews} reviews)</span>
          </div>

          {product.countInStock > 0 && (
            <div className="flex items-center gap-4">
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

      {/* Review Form */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-warning mb-4">Write a Review</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text text-lg">Rating</span>
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              required
              className="input input-bordered input-warning bg-slate-900 w-full max-w-xs"
              placeholder="Rate from 1 to 5"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text text-lg">Your Review</span>
            </label>
            <textarea
              className="textarea textarea-warning bg-slate-900 w-full"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              placeholder="Share your thoughts about the product..."
              rows={4}
            ></textarea>
          </div>
          <button type="submit" disabled={disabled} className="btn btn-warning w-full">
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-warning mb-4">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-lg text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review: Review) => (
              <div key={review._id} className="card bg-slate-950 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-warning">{review.name}</h3>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-warning fill-warning' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}