import { Product } from "@/models/ProductModel"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Rating } from './Rating'

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="card bg-base-300 shadow-xl h-[400px] mb-4 w-[290px] p-5">
      <figure>
        <Link href={`/product/${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={250}
            height={250}
            className="object-cover  w-full rounded-xl"
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link href={`/product/${product._id}`}>
          <h2 className="card-title font-normal">{product.name}</h2>
        </Link>
        <Rating value={product.rating} caption={`(${product.numReviews})`} />
        <p className="mb-2">{product.model}</p>
        <div className="card-actions flex items-center justify-between">
          <span className="text-2xl">${product.price}</span>
        </div>
      </div>
    </div>
  )
}
