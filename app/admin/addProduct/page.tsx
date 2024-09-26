"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";

interface Category {
    _id: string;
    name: string;
  }
  
  interface Product {
    _id: string;
    name: string;
    image: string;
    model: string;
    category: Category;
    description: string;
    numReviews: number;
    price: number;
    countInStock: number;
  }

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editMode, setEditMode] = useState<string | null>(null) 
  const [categories, setCategories] = useState<Category[]>([]);
  const [formMode, setFormMode] = useState<'edit' | 'create'>('create');
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get('name'),
      image: imagePreview,
      model: formData.get('model'),
      category: formData.get('category'),
      description: formData.get('description'),
      numReviews: Number(formData.get('numReviews')),
      price: Number(formData.get('price')),
      countInStock: Number(formData.get('countInStock'))
    };
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success(`${formMode === 'create' ? 'Product created' : 'Product updated'} successfully`);
        setFormMode('create');
        fetchProducts();
      } else {
        throw new Error('Failed to process the request');
      }
    } catch (error) {
      console.log(error);
      
      toast.error(`${formMode === 'create' ? 'Creating' : 'Updating'} product failed`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get('ename'),
      image: imagePreview,
      model: formData.get('emodel'),
      category: formData.get('ecategory'),
      description: formData.get('edescription'),
      numReviews: Number(formData.get('enumReviews')),
      price: Number(formData.get('eprice')),
      countInStock: Number(formData.get('ecountInStock'))
    };
    try {
      const response = await fetch(`/api/products/${editMode}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success(`Product updated successfully`);
        setFormMode('create');
        fetchProducts();
        setEditMode("")
      } else {
        throw new Error('Failed to process the request');
      }
    } catch (error) {
      console.log(error);
      
      toast.error(`Updatingproduct failed`);
    }
  };

  const handleDelete = async (id: string) => {
      try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          toast.success("Product deleted successfully");
          setEditMode("");
          fetchProducts();
        } else {
          throw new Error('Failed to delete the product');
        }
      } catch (error) {
      console.log(error);

        toast.error("Error deleting product");
      }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    }
  };


  return (
    <div className='w-full min-h-screen flex flex-col'>
      <h1 className="text-2xl font-semibold my-3">Manage Products</h1>

      <form onSubmit={handleSubmit} className='w-full  flex flex-col p-10  border border-yellow-500'>
        <div className="w-full flex items-center">
            <div className="flex flex-col">
                <label htmlFor="image" className='bg-gradient-to-r text-xl block '>
            Product Image
          </label><br />
          <input
          name='image'
          id='image'
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className='rounded-xl text-yellow-500 w-[300px] border-none bg-slate-900 font-bold p-2'
          />
            </div>
          
          {imagePreview && <img src={imagePreview as string} alt="Preview" className='w-[200px] mx-5 h-auto mt-2 rounded-md' />}
          <div className='ml-6'>
          <label htmlFor="category" className=' text-xl block'>
            Category
          </label>
          <select
            name="category"
            id="category"
            className='rounded-xl font-bold p-2 bg-slate-900 text-yellow-500'
            required
          >
            <option value="" className='bg-slate-900'>Select Category</option>
            
            {categories?.map((category) => (
              <option key={category._id}  className='bg-slate-900 text-yellow-500 p-1' value={category._id} >{category.name}</option>
            ))}
          </select>
          </div>
        </div>
        <div className="flex w-full  gap-4 py-7  justify-between items-center min-w-[200px] flex-wrap ">
            <div className="w-[250px]  p-4  flex flex-col items-center ">
                <div>
                <label htmlFor="name" className='bg-gradient-to-r text-lg text-slate-400 '>
                    Product Name
                </label><br />
                <input
                    type="text"
                    name="name"
                    id="name"
                    className='rounded-xl bg-slate-900 font-bold p-2 text-yellow-400'
                    placeholder='Product Name'
                    required
                />
                </div>
                <div>
                <label htmlFor="name" className='bg-gradient-to-r text-lg text-slate-400 '>
                    Product Model
                </label><br />
                <input
                    type="text"
                    name="model"
                    id="model"
                    className='rounded-xl bg-slate-900 font-bold p-2 text-yellow-400'
                    placeholder='Product Model'
                    required
                />
                </div>
            </div>
            <div className="w-[250px]  p-4  flex flex-col items-center ">
                <div>
                <label htmlFor="name" className='bg-gradient-to-r text-lg text-slate-400 '>
                    Product Price
                </label><br />
                <input
                    type="number"
                    name="price"
                    id="price"
                    className='rounded-xl bg-slate-900  font-bold p-2 text-yellow-400'
                    placeholder='Product Name'
                    required
                />
                </div>
                <div>
                <label htmlFor="name" className='bg-gradient-to-r text-lg text-slate-400 '>
                    Count in stock
                </label><br />
                <input
                    type="number"
                    name="countInStock"
                    id="countInStock"
                    className='rounded-xl bg-slate-900  font-bold p-2 text-yellow-400'
                    placeholder='Product Count InStock'
                    required
                />
                </div>
            </div>
            <div className="w-[350px]  p-4  flex flex-col items-center ">
            
          <div>
          <label htmlFor="description" className='my-2text-xl block '>
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className='rounded-xl text-yellow-500 w-[300px] h-[100px] focus:outline-purple-600 border-none bg-slate-900 font-bold p-2'
            placeholder='Description'
            required
          />
          </div>
            </div>
        </div>
        <button className='w-full rounded-xl p-4 text-center font-bold bg-yellow-500 text-slate-950'>Create Product</button>
      </form>

      <div className="w-full">
      <h1 className="text-2xl font-semibold my-5">Manage Products</h1>

      <div className="overflow-x-auto">
            <table className="table static">
                {/* head */}
                <thead>
                <tr>
                    <th>image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Edit</th>
                    <th>Delete</th>

                </tr>
                </thead>
                <tbody>
                {/* row 1 */}
                {products?.map((product)=>(
                     <tr>
                     <th><img src={product.image} alt={product.name}  className='w-[60px]'/></th>
                     <td>{product.name}</td>
                     <td>{product.category.name}</td>
                     <td>{product.price}</td>
                     <td><button onClick={()=> setEditMode(product._id)} className='text-[lime] font-bold'><FaEdit/></button>
                     {editMode === product._id &&(
                        <div className="bg-slate-950 border border-yellow-500 p-10 m-10 rounded-xl  min-h-[500px] flex flex-col absolute right-0 left-0 top-[50vh] z-50 shadow-xl shadow-black">
                            <h1 className="textxl font-bold text-yellow-500">Update {product.name}</h1>
                            <form onSubmit={handleEditSubmit} className='w-full  flex flex-col p-10  '>
                                    <div className="w-full flex items-center">
                                        <div className="flex flex-col">
                                            <label htmlFor="eimage" className='bg-gradient-to-r text-xl block '>
                                        Product Image
                                    </label><br />
                                    <input
                                    name='eimage'
                                    id='eimage'
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className='rounded-xl text-yellow-500 w-[150px] border-none bg-slate-900 font-bold p-2'
                                    />
                                        </div>
                                    
                                    {imagePreview && <img src={imagePreview as string} alt="Preview" className='w-[200px] mx-3 h-auto mt-2 rounded-md' />}
                                    <div className='ml-3'>
                                    <label htmlFor="ecategory" className=' text-xl block'>
                                        Category
                                    </label>
                                    <select
                                        name="ecategory"
                                        id="ecategory"
                                        className='rounded-xl font-bold p-2 bg-slate-900 text-yellow-500'
                                        required
                                    >
                                        <option value="" className='bg-slate-900'>Select Category</option>
                                        
                                        {categories.map((category) => (
                                        <option key={category._id}  className='bg-slate-900 text-yellow-500 p-1' value={category._id} >{category.name}</option>
                                        ))}
                                    </select>
                                    </div>
                                    </div>
                                    <div className="flex w-full  gap-4 py-7  justify-between items-center min-w-[200px] flex-wrap ">
                                        <div className="w-[150px]  p-4  flex flex-col items-center ">
                                            <div>
                                            <label htmlFor="ename" className='bg-gradient-to-r text-lg text-slate-400 '>
                                                Product Name
                                            </label><br />
                                            <input
                                                type="text"
                                                name="ename"
                                                id="ename"
                                                className='rounded-xl bg-slate-900 font-bold p-2 text-yellow-400'
                                                placeholder='Product Name'
                                                required
                                            />
                                            </div>
                                            <div>
                                            <label htmlFor="emodel" className='bg-gradient-to-r text-lg text-slate-400 '>
                                                Product Model
                                            </label><br />
                                            <input
                                                type="text"
                                                name="emodel"
                                                id="emodel"
                                                className='rounded-xl bg-slate-900 font-bold p-2 text-yellow-400'
                                                placeholder='Product Model'
                                                required
                                            />
                                            </div>
                                        </div>
                                        <div className="w-[150px]  p-4  flex flex-col items-center ">
                                            <div>
                                            <label htmlFor="eprice" className='bg-gradient-to-r text-lg text-slate-400 '>
                                                Product Price
                                            </label><br />
                                            <input
                                                type="number"
                                                name="eprice"
                                                id="eprice"
                                                className='rounded-xl bg-slate-900  font-bold p-2 text-yellow-400'
                                                placeholder=' price'
                                                required
                                            />
                                            </div>
                                            <div>
                                            <label htmlFor="ecount" className='bg-gradient-to-r text-lg text-slate-400 '>
                                                Count in stock
                                            </label><br />
                                            <input
                                                type="number"
                                                name="ecountInStock"
                                                id="ecountInStock"
                                                className='rounded-xl bg-slate-900  font-bold p-2 text-yellow-400'
                                                placeholder=' Count InStock'
                                                required
                                            />
                                            </div>
                                        </div>
                                        <div className="w-[250px]  p-4  flex flex-col items-center ">
                                        
                                    <div>
                                    <label htmlFor="edescription" className='my-2text-xl block '>
                                        Description
                                    </label>
                                    <textarea
                                        name="edescription"
                                        id="edescription"
                                        className='rounded-xl text-yellow-500 w-[200px] h-[100px] focus:outline-purple-600 border-none bg-slate-900 font-bold p-2'
                                        placeholder='Description'
                                        required
                                    />
                                    </div>
                                        </div>
                                    </div>
                                    <button className='w-full rounded-xl p-4 text-center font-bold bg-yellow-500 text-slate-950'>Create Product</button>
                                </form>
                        </div>
                     )}
                     </td>
                     <td><button onClick={()=>handleDelete(product._id)} className='text-[red] font-bold'><FaTrash/></button>
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
