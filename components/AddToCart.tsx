'use client'

import useCartService from '@/lib/hooks/useCartStore'
import { OrderItem } from '@/models/OrderModel'
import { useEffect, useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'

export default function AddToCart({ item }: { item: OrderItem }) {
  const { items, increase, decrease } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  useEffect(() => {
    setExistItem(items.find((x) => x.name === item.name))
  }, [item, items])

  const addToCartHandler = () => {
    increase(item)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      {existItem ? (
        <div className="join">
          <button
            className="btn btn-warning btn-sm join-item"
            type="button"
            onClick={() => decrease(existItem)}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="btn btn-warning btn-sm join-item no-animation pointer-events-none">
            {existItem.qty}
          </span>
          <button
            className="btn btn-warning btn-sm join-item"
            type="button"
            onClick={() => increase(existItem)}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          className="btn btn-warning btn-sm sm:btn-md w-full"
          type="button"
          onClick={addToCartHandler}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to cart
        </button>
      )}
    </div>
  )
}