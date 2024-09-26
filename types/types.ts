export interface Category {
    _id: string;
    name: string;
  }
  
  export interface Product {
    _id: string;
    name: string;
    image: string;
    model: string;
    onPromotion: boolean;
    category: Category;
    description: string;
    numReviews: number;
    price: number;
    countInStock: number;
    rating: number
  }

  export type Order = {
    _id: string
    user?: { firstname: string }
    items: [OrderItem]
    shippingAddress: {
      fullName: string
      address: string
      city: string
      postalCode: string
      country: string
    }
    paymentMethod: string
    paymentResult?: { id: string; status: string; email_address: string }
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
    isPaid: boolean
    isDelivered: boolean
    paidAt?: string
    deliveredAt?: string
    createdAt: string
  }

  export type OrderItem = {
    _id:  string
    name: string
    model: string
    category: {
      _id:string
      name: string
    }
    qty: number
    image: string
    price: number
    description: string
  }
  
  export type ShippingAddress = {
    fullName: string
    address: string
    city: string
    postalCode: string
    country: string
  }

  export type User = {
    _id: string
    firstname: string,
    lastname: string,
    email: string,
    isAdmin: boolean,
  }