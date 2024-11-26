"use client";
import { getToken } from "@/utils/getToken";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type TokenPayload = {
  pengguna_id: number;
  role: string;
};

type UserDetails = {
  nama: string;
  email: string;
  role: string;
};

const AdminDashboard = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const decoded = jwtDecode<TokenPayload>(token);
        
        const { data } = await axios.get<UserDetails>(`http://localhost:5000/api/users/${decoded.pengguna_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        Access Denied: Administrator privileges required
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Selamat Datang, {user.nama}</h1>
        <p className="text-gray-600">Admin Dashboard</p>
      </div>
      
      <div className="grid gap-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Profile Anda</h3>
          <p><strong>Name:</strong> {user.nama}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;