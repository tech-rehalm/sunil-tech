"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Category, Order, Product, User } from '@/types/types';
import Chart from '@/components/Chat';
import Customers from '@/components/Customers';
import { Products } from '@/components/Products';
import { Overview } from '@/components/Overview';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]); 

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data); // Set the fetched users to state
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories as Category[]);
    } catch (error: any) {
      console.log(error);
    }
  };
    
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products');
          const data = await response.json();
          setProducts(data.products as Product[]);
        } catch (error) {
          toast.error("Failed to fetch products");
        }
      };

      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/admin/orders')
          if (!res.ok) {
            throw new Error('Failed to fetch orders')
          }
          const data = await res.json()
          setOrders(data)
        } catch (err) {
          console.log(err);
          
        } finally {
          setLoading(false)
        }
      }

      useEffect(() => {
        fetchProducts();
        fetchOrders()
        fetchCategories()
        fetchUsers()
      }, []);
      if(loading) return <h1>Loading</h1>

  return (
    <div className='w-full flex flex-col min-h-screen'>
      <div className="w-full flex md:flex-row flex-col p-5 gap-3 justify-between">
        <div className="w-[25%] cursor-pointer rounded-xl border text-yellow-500 border-yellow-500 bg-slate-900 transit duration-500 hover:bg-slate-700 h-[100px] flex flex-col items-center justify-center gap-3">
          <h1 className="text-3xl font-text-bold">{products?.length}</h1>
          <p className="text-center opacity-70 font-light">Total products on stock</p>
        </div>
        <div className="w-[25%] cursor-pointer rounded-xl border text-yellow-500 border-yellow-500 bg-slate-900 transit duration-500 hover:bg-slate-700 h-[100px] flex flex-col items-center justify-center gap-3">
          <h1 className="text-3xl font-text-bold">{orders?.length}</h1>
          <p className="text-center opacity-70 font-light">Total orders </p>
        </div>
        <div className="w-[25%] cursor-pointer rounded-xl border text-yellow-500 border-yellow-500 bg-slate-900 transit duration-500 hover:bg-slate-700 h-[100px] flex flex-col items-center justify-center gap-3">
          <h1 className="text-3xl font-text-bold">{users?.length}</h1>
          <p className="text-center opacity-70 font-light">Total users </p>
        </div>
        <div className="w-[25%] cursor-pointer rounded-xl border text-yellow-500 border-yellow-500 bg-slate-900 transit duration-500 hover:bg-slate-700 h-[100px] flex flex-col items-center justify-center gap-3">
          <h1 className="text-3xl font-text-bold">{categories?.length}</h1>
          <p className="text-center opacity-70 font-light">Total categories</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <Chart/>
        <Customers/>
        <Products/>
      </div>
      <span className='divider mt-10'></span>
      <div className="w-full flex flec-col md:flex-row mt-10">
        <Overview/>
        <div className="w-full md:w-[70%] rounded-xl flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-yellow-500">Sunil Tech</h1>
          <h1 className="text-xl font-bold text-yellow-500 my-4">Code of conduct and privacy policy</h1>
          <p className="text-sm font-light text-center w-[80%] text-slate-400">Sunil tech store stands to provide technology devices and acesories.Ensuring delivery of high quality and affordable products.We stand not only to gain or make profit but also to promote the tech industry in making people's live easier.We strictl provide original branded products from the manufactures.Any unfair practice or service is handled by management to ensure the orgabization meet all legal standards.</p>
          <p className="font-bold text-slate-500 mt-8">&copy; SunilTech All Rights Reserved</p>
        </div>
      </div>
    </div>
  )
}
