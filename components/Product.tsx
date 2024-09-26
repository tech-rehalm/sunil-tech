import Link from 'next/link'
import React from 'react'

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

export default function Product({product}:{product: Product}) {
  return (
  <Link href={`/product/${product._id}`}>
    <div className='w-[250px] p-3 flex flex-col text-yellow-500 bg-slate-700 rounded-lg transition duration-500 hover:bg-base-300 hover:border hover:border-yellow-500'>
        <img src={product.image} alt={product.name} className='rounded-lg h-[200px] object-cover'/>
        <h1 className="text-lg">Name: {product.name}</h1>
        <div className="flex w-full justify-between">
            <h1 className="text-lg opacity-70">{product.model}</h1>
            <h1 className="text-lg opacity-70">{product.category.name}</h1>
        </div>
        <p className="text-white opacity-50 font-light my-2">{product.description.substring(0, 40)}...</p>
        <p className="opacity-90 font-light mb-3">Price: <span className="p-2 px-8 ml-5 rounded-xl w-[70px] text-center bg-yellow-500 text-slate-900 ">${product.price}</span></p>
      
    </div></Link>
  )
}
