"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  pengguna_id: number;
  role: string;
};

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const { data } = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        });
    
        localStorage.setItem("token", data.token);
    
        const decoded = jwtDecode<TokenPayload>(data.token);
        
        if (decoded.role === 'admin') {
            router.push('/admin');
        } else if (decoded.role === 'pengguna') {
           router.push('/member');
        } else {
            console.error("invalid role from server");
        }
      }
        catch(error) {
            console.error('Login failed', error);
        }


  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96 fade-in">
            {/* Tombol Home */}
           <Link href="/">
               <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mb-4">
                 Home
             </button>
           </Link>
          <h1 className="text-2xl font-bold text-center mb-4">Selamat datang di Sistem Informasi Bank Sampah</h1>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Belum punya Akun?
            <Link
              href="/register"
              className="text-green-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}