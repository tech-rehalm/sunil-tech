"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User, ShieldCheck, ShoppingBag, Truck, DollarSign, Tag, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Order, Product, User as UserType } from "@/types/types";

export default function Settings() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const fetchData = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/admin/orders"),
        fetch("/api/products"),
      ]);

      if (!usersRes.ok || !ordersRes.ok || !productsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [usersData, ordersData, productsData] = await Promise.all([
        usersRes.json(),
        ordersRes.json(),
        productsRes.json(),
      ]);

      setUsers(usersData);
      setOrders(ordersData);
      setProducts(productsData.products);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeRole = async (userId: string, isAdmin: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });

      if (!res.ok) throw new Error("Failed to change user role");

      const updatedUser = await res.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: updatedUser.isAdmin } : user
        )
      );

      toast.success(`User role changed to ${updatedUser.isAdmin ? "Admin" : "Customer"}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to change user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const handleOrderStatus = async (id: string, field: 'isPaid' | 'isDelivered', value: boolean) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !value }),
      });

      if (!res.ok) throw new Error(`Failed to update order ${field}`);

      await fetchData();
      toast.success(`Order ${field === 'isPaid' ? 'payment' : 'delivery'} status updated`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update order ${field}`);
    }
  };

  const handlePromote = async (id: string, onPromotion: boolean) => {
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onPromotion: !onPromotion }),
      });

      if (!res.ok) throw new Error("Promotion change failed");

      await fetchData();
      toast.success("Promotion state changed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to change promotion state");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-warning"></span>
    </div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-warning">Admin Settings</h1>
      <div className="tabs tabs-boxed mb-4">
        <a className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`} onClick={() => setActiveTab('users')}>Users</a>
        <a className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</a>
        <a className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`} onClick={() => setActiveTab('products')}>Products</a>
      </div>
      {activeTab === 'users' && (
        <div className="card bg-slate-900 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-warning">All Users</h2>
            <div className="overflow-x-auto">
              <table className="table  w-full">
                <thead>
                  <tr className="text-gray-200">
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{`${user.firstname} ${user.lastname}`}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? "Admin" : "Customer"}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm mr-2"
                          onClick={() => handleChangeRole(user._id, user.isAdmin)}
                        >
                          <ShieldCheck className="w-4 h-4 mr-1 hidden md:block" />
                          Change Role
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1 hidden md:block" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'orders' && (
        <div className="card bg-slate-900 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-warning">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="table  w-full">
                <thead>
                  <tr className="text-gray-200">
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Items</th>
                    <th>Shipping Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user?.firstname}</td>
                      <td>{order.items.length}</td>
                      <td>{`${order.shippingAddress.country}, ${order.shippingAddress.city}`}</td>
                      <td>
                        <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-error'} mr-2 mb-2`}>
                          {order.isPaid ? 'Paid' : 'Not Paid'}
                        </span>
                        <span className={`badge flex ${order.isDelivered ? 'badge-success' : 'badge-error'}`}>
                          {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm mr-2 my-2"
                          onClick={() => handleOrderStatus(order._id, 'isPaid', order.isPaid)}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Toggle Payment
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleOrderStatus(order._id, 'isDelivered', order.isDelivered)}
                        >
                          <Truck className="w-4 h-4 mr-1 hidden md:block" />
                          Toggle Delivery
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'products' && (
        <div className="card bg-slate-900 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-warning">All Products</h2>
            <div className="overflow-x-auto">
              <table className="table  w-full">
                <thead>
                  <tr className="text-gray-200">
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Promotion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={product.image} alt={product.name} />
                          </div>
                        </div>
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category.name}</td>
                      <td>{product.countInStock}</td>
                      <td>
                        {product.onPromotion ? (
                          <CheckCircle className="text-success" />
                        ) : (
                          <XCircle className="text-error" />
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm mr-2 flex mb-1"
                          onClick={() => handlePromote(product._id, product.onPromotion)}
                        >
                          <Tag className="w-4 h-4 mr-1 hidden md:block" />
                          Toggle Promotion
                        </button>
                        <button className="btn btn-warning btn-sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}