import Link from 'next/link'
import React from 'react'

export default function Hero() {
  return (
    <div className='w-full h-[70vh] relative'>
      <video src="/bg.mp4" autoPlay muted loop className='w-full z-10 h-full object-cover opacity-20 absolute'>
      </video>
      <div className="w-full h-full z-20 bg-[#0f110f] flex flex-col items-center justify-center gap-5">
        <h1 className="text-5xl md:text-8xl font-extralight text-yellow-500">Sunil tech store</h1>
        <p className="text-lg font-light w-full md:w-[70%] text-center">Get your devices and accesories in lower prices today.We offer good discounts to our customers.We got you covered today.Our products includes computers, laptops, mobile phones and so much more.</p>
        <Link href="/shop"><button className="btn btn-warning z-50">Scroll for more </button>
        </Link>
      </div>
    </div>
  )
}
