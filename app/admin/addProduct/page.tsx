'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"
import * as filestack from 'filestack-js'

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
}

const client = filestack.init(process.env.NEXT_PUBLIC_FILESTACK_API_KEY as string)

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formMode, setFormMode] = useState<'edit' | 'create'>('create')
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleImageUpload = () => {
    const options = {
      maxFiles: 1,
      accept: ['image/*'],
      onUploadDone: (res: any) => {
        setImageUrl(res.filesUploaded[0].url)
      },
    }
    client.picker(options).open()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const productData = {
      name: formData.get('name'),
      image: imageUrl,
      model: formData.get('model'),
      category: formData.get('category'),
      description: formData.get('description'),
      numReviews: Number(formData.get('numReviews')),
      price: Number(formData.get('price')),
      countInStock: Number(formData.get('countInStock'))
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast.success(`Product created successfully`)
        fetchProducts()
      } else {
        throw new Error('Failed to process the request')
      }
    } catch (error) {
      console.error(error)
      toast.error(`Creating product failed`)
    }
  }

  const handleUpdate = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        toast.success('Product updated successfully')
        setEditingProduct(null)
        fetchProducts()
      } else {
        throw new Error('Failed to update the product')
      }
    } catch (error) {
      console.error(error)
      toast.error('Updating product failed')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success("Product deleted successfully")
        fetchProducts()
      } else {
        throw new Error('Failed to delete the product')
      }
    } catch (error) {
      console.error(error)
      toast.error("Error deleting product")
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products as Product[])
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch products")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category')
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch categories")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, productId: string) => {
    const { name, value } = e.target
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId ? { ...product, [name]: value } : product
      )
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      <div className="card bg-base-200 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Create New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>
              <div className="flex items-center space-x-4">
                <button type="button" onClick={handleImageUpload} className="btn btn-warning">
                  Upload Image
                </button>
                {imageUrl && <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select name="category" className="select select-warning w-full" required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Name</span>
                </label>
                <input type="text" name="name" placeholder="Product Name" className="input input-warning" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Model</span>
                </label>
                <input type="text" name="model" placeholder="Product Model" className="input input-warning" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Price</span>
                </label>
                <input type="number" name="price" placeholder="Product Price" className="input input-warning" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Count in Stock</span>
                </label>
                <input type="number" name="countInStock" placeholder="Count in Stock" className="input input-warning" required />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea name="description" placeholder="Description" className="textarea textarea-warning h-24" required></textarea>
            </div>

            <button type="submit" className="btn btn-warning w-full">
              Create Product
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Count in Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td>
                  {editingProduct === product._id ? (
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={(e) => handleInputChange(e, product._id)}
                      className="input input-warning input-sm"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editingProduct === product._id ? (
                    <select
                      name="category"
                      value={product.category._id}
                      onChange={(e) => handleInputChange(e, product._id)}
                      className="select select-warning select-sm"
                    >
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                      ))}
                    </select>
                  ) : (
                    product.category.name
                  )}
                </td>
                <td>
                  {editingProduct === product._id ? (
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={(e) => handleInputChange(e, product._id)}
                      className="input input-warning input-sm"
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                <td>
                  {editingProduct === product._id ? (
                    <input
                      type="number"
                      name="countInStock"
                      value={product.countInStock}
                      onChange={(e) => handleInputChange(e, product._id)}
                      className="input input-warning input-sm"
                    />
                  ) : (
                    product.countInStock
                  )}
                </td>
                <td>
                  {editingProduct === product._id ? (
                    <>
                      <button onClick={() => handleUpdate(product)} className="btn btn-ghost btn-xs">
                        <FaSave className="text-success" />
                      </button>
                      <button onClick={() => setEditingProduct(null)} className="btn btn-ghost btn-xs">
                        <FaTimes className="text-warning" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingProduct(product._id)} className="btn btn-ghost btn-xs">
                        <FaEdit className="text-warning" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="btn btn-ghost btn-xs">
                        <FaTrash className="text-error" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}