'use client'
import useCartService from '@/lib/hooks/useCartStore'
import { OrderItem } from '@/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AddToCart({ item }: { item: OrderItem }) {
  const { items, increase , decrease} = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  useEffect(() => {
    setExistItem(items.find((x) => x.name === item.name))
  }, [item, items])

  const addToCartHandler = () => {
    increase(item)
  }
  return existItem ? (
    <div className='min-w-[200px]'>
      <button className="btn bg-yellow-500 text-black transition duration-500 hover:bg-yellow-700" type="button" onClick={() => decrease(existItem)}>
        -
      </button>
      <span className="px-2">{existItem.qty}</span>
      <button className="btn bg-yellow-500 text-black transition duration-500 hover:bg-yellow-700" type="button" onClick={() => increase(existItem)}>
        +
      </button>
    </div>
  ) : (
    <button
      className="btn bg-yellow-500 text-black transition duration-500 hover:bg-yellow-700 btn-primary w-full"
      type="button"
      onClick={addToCartHandler}
    >
      Add to cart
    </button>
  )
}
