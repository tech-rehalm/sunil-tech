"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash } from "react-icons/fa";

interface Category{
  _id: string,
  name: string
}

export default function Page() {
  const [name, setName] = useState("")
  const [editMode, setEditMode] = useState<string | null>(null) // Track specific category being edited
  const [categories, setCategories] = useState<Category[]>([]);
  const [editName, setEditName] = useState("") // Store the updated name of the category being edited

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories as Category[]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      if (res.ok) {
        toast.success("Category created successfully");
        setName(""); // Clear input field after success 
        fetchCategories(); // Refresh categories
      } else {
        toast.error("Error creating the category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating the category");
    }
  };

  const handleEditSubmit = async (catId: string) => {
    try {
      const res = await fetch(`/api/category`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: catId, name: editName }), // Send updated category name
      });

      if (res.ok) {
        toast.success("Category updated successfully");
        setEditMode(null); // Exit edit mode
        fetchCategories(); // Refresh the category list
      } else {
        toast.error("Error updating category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating the category");
    }
  };

  const handleDelete = async (catId: string) => {
    try {
      const res = await fetch(`/api/category`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: catId }), // Send category id for deletion
      });

      if (res.ok) {
        toast.success("Category deleted successfully");
        fetchCategories(); // Refresh the category list
      } else {
        toast.error("Error deleting category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting the category");
    }
  };

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <h1 className="text-2xl font-semibold">Manage Categories</h1>
      <span className="divider"></span>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input 
          type="text" 
          className='w-[300px] p-3 rounded-xl focus:outline-yellow-500 bg-slate-900 text-yellow-500 font-bold' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter category name"
          required
        />
        <button type='submit' className='w-[300px] rounded-xl p-3 my-3 text-center font-bold text-lg bg-yellow-500 text-slate-950'>
          Create Category
        </button>
      </form>
      <span className="divider"></span>
      <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead className='text-lg font-bold text-yellow-500'>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='text-slate-400'>
            {categories?.map((cat) => (
              <tr key={cat._id} className='hover:bg-slate-700'>
                <th></th>
                <td>{cat._id}</td>
                <td>
                  {/* Conditionally render either the input for edit or just the category name */}
                  {editMode === cat._id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-800 text-yellow-500 p-2 rounded"
                    />
                  ) : (
                    <span>{cat.name}</span>
                  )}
                </td>
                <td>
                  {editMode === cat._id ? (
                    <button onClick={() => handleEditSubmit(cat._id)} className='border-none text-green-500'>
                      Save
                    </button>
                  ) : (
                    <button onClick={() => {
                      setEditMode(cat._id); // Set the specific category to edit
                      setEditName(cat.name); // Populate the input with current name
                    }} className='border-none '>
                      <FaEdit className='text-[lime]'/>
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(cat._id)} className='border-none text-red-500'>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}
