import { User } from '@/types/types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
}
export interface Category {
  _id: string;
  name: string;
}
export interface Product {
  _id: string;
  name: string;
  image: string;
  model: string;
  category: Category; // Category object with name property
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  createdAt: string; // ISO date string
}

interface RevProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  session: any;   // Adjust type as necessary
  disabled: boolean;
}
const Rev: React.FC<RevProps> = ({ product, setProduct, session, disabled }) => {
  const [review, setReview] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('You need to be logged in to submit a review.');
      return;
    }

    const id = product._id; // Ensure this matches your Product's id field

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviews: [
          ...product.reviews,
          {
            name: session.user.firstname,
            rating,
            comment: review,
            user: session.user._id,
          },
        ],
        numReviews: product.numReviews + 1,
        rating: ((product.rating * product.numReviews) + rating) / (product.numReviews + 1),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setProduct(data.product);
      setReview('');
      setRating(0);
      toast.success("Review added successfully")
    } else {
      toast.error("Failed to submit review:", data.error);
    }
  };

  return (
    <div>
      <h2 className='w-full text-3xl my-3 text-yellow-500 font-semibold'>Write a Review</h2>
      <form onSubmit={handleReviewSubmit}>
        <div className='flex w-full flex-col md:flex-row items-center justify-around'>
          <label className='w-full min-w-[50%] text-yellow-500 text-2xl font-bold my-4'>
            Rate the product: <br />
            <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            required
              placeholder="Type here"
              className="input input-bordered my-2 input-warning w-full max-w-xs" />
          </label>
        <div className='w-full min-w-[50%] md:min-w-[400px] '>
          <label className=' text-yellow-500 text-2xl font-bold  my-4 w-full md:min-w-[400px]'>
            Share your review: <br />
            <textarea className="textarea textarea-warning w-[80%] my-3" value={review}
              onChange={(e) => setReview(e.target.value)}
              required  placeholder="Best product ..."></textarea>
          </label>
        </div>
        </div>
        <button disabled={disabled} className="btn btn-warning w-full">Submit Review</button>
      </form>
    </div>
  );
};

export default Rev;
