"use client"

import React, { useEffect, useState } from 'react'

type User = {
  firstname: string,
  lastname: string,
  email: string,
  isAdmin: boolean,
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]); // Correct type: an array of User

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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <h1 className="text-2xl font-semibold">All users</h1>
      <div className="overflow-x-auto">
        <table className="table ">
          {/* head */}
          <thead>
            <tr className='bg-gray-800 text-yellow-500'>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Admin Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through the users and render each row */}
            {users.map((user, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Admin' : 'User'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
