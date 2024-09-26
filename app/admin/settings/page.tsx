"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, Product, User } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Settings() {
  const [users, setUsers] = useState<User[]>([]); 
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products as Product[]);
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to fetch products");
    }
  };


  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data); // Set the fetched users to state
    } catch (error) {
      console.log(error);
      
      console.error("Error fetching users:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, isAdmin: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });

      if (!res.ok) {
        throw new Error("Failed to change user role");
      }

      const updatedUser = await res.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: updatedUser.isAdmin } : user
        )
      );

      toast.success(`User role changed to ${updatedUser.isAdmin ? "Admin" : "Customer"}`);
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.log(error);
      
    }
  };

  const handlePay = async (id: string, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPaid: !isPaid }),
      });

      if (!res.ok) {
        throw new Error("Failed to setPayment");
      }
      fetchOrders();
      toast.success("Order has been paid");
    } catch (error) {
      console.log(error);
      
    }
  };

  const handlePromote = async (id: string, onPromotion: boolean) => {
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ onPromotion: !onPromotion }),
      });

      if (!res.ok) {
        throw new Error("Promotion change failed");
      }
      fetchProducts();
      toast.success("Promotion state changed");
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleDeliver = async (id: string, isDelivered: boolean) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDelivered: !isDelivered }),
      });

      if (!res.ok) {
        throw new Error("Failed to set order delivery");
      }
      fetchOrders();
      toast.success("Order has been delivered");
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchProducts();
  }, []);

  return (
    <div className="w-full p-5 flex-flex-col min-h-screen">
      <h1 className="text-3xl font-bold my-5">All Users</h1>
    <Table>
      <TableCaption>A list of sunil subscribers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">User ID</TableHead>
          <TableHead className="">First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Role</TableHead>
          <TableHead className="text-right">Change Role</TableHead>
          <TableHead className="text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{user._id}</TableCell>
            <TableCell className="font-medium">{user.firstname}</TableCell>
            <TableCell>{user.lastname}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">
              {user.isAdmin ? "Admin" : "Customer"}
            </TableCell>
            <TableCell className="text-right">
              <button
                className="font-bold p-2 rounded-xl text-black bg-[lime]"
                onClick={() => handleChangeRole(user._id, user.isAdmin)}
              >
                Change role
              </button>
            </TableCell>
            <TableCell className="text-right">
              <button
                className="font-bold p-2 rounded-xl text-black bg-red-500"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Total</TableCell>
          <TableCell className="text-right">{users.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    <h1 className="text-3xl font-bold my-5">All orders</h1>
    <Table>
      <TableCaption>A list of orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Order ID</TableHead>
          <TableHead className="">User Name</TableHead>
          <TableHead>Total Items</TableHead>
          <TableHead>Shipping Adress</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Delivered</TableHead>
          <TableHead className="text-right">Change Status</TableHead>
          <TableHead className="text-right">Deliver</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order._id}>
            <TableCell className="font-medium">{order._id}</TableCell>
            <TableCell className="font-medium">{order.user?.firstname}</TableCell>
            <TableCell>Items: {order.items.length}</TableCell>
            <TableCell>{order.shippingAddress.country} {order.shippingAddress.city}</TableCell>
            <TableCell className="text-right">
                {order.isPaid? <p className="text-[lime]">Paid</p>:<p className="text-[red]">Not Paid</p> }
              
            </TableCell>
            <TableCell className="text-right">
              {order.isDelivered? <p className="text-[lime]">Delivered</p>:<p className="text-[red]">Not Delivered</p> }
            </TableCell>
            <TableCell className="text-right">
              <button
                className="font-bold p-2 rounded-xl text-black bg-[lime]"
                onClick={() => handlePay(order._id, order.isPaid)}
              >
                Set Paid
              </button>
            </TableCell>
            <TableCell className="text-right">
              <button
                className="font-bold p-2 rounded-xl text-black bg-[#4ffd4f]"
                onClick={() => handleDeliver(order._id, order.isDelivered)}
              >
                Set Delivered
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total</TableCell>
          <TableCell className="text-right">{orders?.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    <h1 className="text-3xl font-bold my-5">All Products</h1>
    <Table>
      <TableCaption>A list of orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Product ID</TableHead>
          <TableHead className="">Product Image</TableHead>
          <TableHead className="">Product Name</TableHead>
          <TableHead>Product Model</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Count In Stock</TableHead>
          <TableHead className="text-right">Description</TableHead>
          <TableHead className="text-right">On Promotion</TableHead>
          <TableHead className="text-right">Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.map((product) => (
          <TableRow key={product._id}>
            <TableCell className="font-medium"><img src={product.image} alt={product.name} className="h-[40px] w-[60px] object-cover rounded-lg" /></TableCell>
            <TableCell className="font-medium">{product._id}</TableCell>
            <TableCell className="font-light">{product.name}</TableCell>
            <TableCell>{product.model}</TableCell>
            <TableCell>{product.category.name}</TableCell>
            <TableCell className="text-right">
               {product.countInStock}
            </TableCell>
            <TableCell className="">
              {product.description.substring(0,20)}...
            </TableCell>
            <TableCell className="text-right">
              <button
                className="font-bold  text-black "
                // onClick={() => handlePay(product._id, product.isPaid)}
              >
                {product.onPromotion? <p className="text-[white] font-bold w-full h-full p-2 px-3 rounded-xl bg-violet-600">True</p>: <p className="text-black p-2 rounded-xl bg-[lime]">False</p> }
              </button>
            </TableCell>
            <TableCell className="text-right">
              <button
                className="font-bold p-2 rounded-xl text-black bg-[#4ffd4f]"
                onClick={() => handlePromote(product._id, product.onPromotion)}
              >
                Promote
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={8}>Total</TableCell>
          <TableCell className="text-right">{products?.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    </div>
  );
}
