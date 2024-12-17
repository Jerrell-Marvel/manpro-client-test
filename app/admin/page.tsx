"use client";

import { getToken } from "@/utils/getToken";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
    BarChart, 
    Bar,
    PieChart,
    Pie,
    ResponsiveContainer
    } from 'recharts';

type TokenPayload = {
    pengguna_id: number;
    role: string;
};

type UserDetails = {
    nama: string;
    email: string;
    role: string;
};

type StatsData = {
    totalMembers: number;
    newMembers: number;
    totalTransaksiMasuk: number;
    totalTransaksiKeluar: number;
    nilaiTotalTransaksi: number;
    nilaiTotalTransaksiKeluar: number;
    totalJenisSampah: number;
        sampahTerbanyakKuantitas: {
            nama_sampah: string;
            total_kuantitas: number;
        }[];
        sampahTerbanyakNilai: {
           nama_sampah: string;
           total_nilai: number;
        }[];
        totalSuk: number;
        totalItemInventory: number;
        totalKuantitasInventory: number;
        itemTerbanyakInventory: {
            nama_sampah: string,
            kuantitas: number
        }[];
}

const AdminDashboard = () => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<StatsData | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");


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

        const fetchDashboardStats = async () => {
          try{
             const { data } = await axios.get<StatsData>("http://localhost:5000/api/stats/dashboard", {
                headers: {
                   Authorization: `Bearer ${getToken()}`
                  },
                 params: {
                     startDate,
                     endDate
                 }
             });
             setStats(data);
           } catch(err) {
             console.error('Error fetching dashboard stats: ', err)
             setError('Failed to fetch dashboard data');
          }
        }
        fetchUserDetails();
        fetchDashboardStats();
      }, [startDate, endDate]);

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

    const dataTransaksi = [
        {
            name: "Pemasukan",
            total: stats?.nilaiTotalTransaksi,
        },
         {
            name: "Pengeluaran",
             total: stats?.nilaiTotalTransaksiKeluar
            }
    ]
    
    const dataSampah = (stats?.sampahTerbanyakKuantitas || []).map(item => {
        return {
            name: item.nama_sampah,
            total: item.total_kuantitas
        }
    });
    

     const dataInventory = (stats?.itemTerbanyakInventory || []).map(item => {
           return {
            name: item.nama_sampah,
            total: item.kuantitas
        }
      });

  
    return (
        <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Selamat Datang, {user.nama}</h1>
              <p className="text-gray-600">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4 mb-8">
                 <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
                     <label htmlFor="start-date">Mulai : </label>
                     <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                 </div>
                <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
                <label htmlFor="end-date">Sampai : </label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Profile Anda</h3>
                    <p><strong>Name:</strong> {user.nama}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
    
              <div className="bg-white p-4 rounded-lg shadow-md">
                   <h3 className="text-lg font-semibold mb-2">Jumlah Member</h3>
                    <p className="text-4xl font-bold text-green-600">{stats?.totalMembers}</p>
                    <p className="text-sm text-gray-500">Member baru : {stats?.newMembers}</p>
               </div>
    
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Jumlah Total SUK</h3>
                    <p className="text-4xl font-bold text-blue-600">{stats?.totalSuk}</p>
                 </div>

               <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Transaksi</h3>
                      <p>Total Transaksi Masuk : <span className="font-bold text-green-600">{stats?.totalTransaksiMasuk}</span></p>
                      <p>Total Transaksi Keluar : <span className="font-bold text-red-600">{stats?.totalTransaksiKeluar}</span></p>
                      <p>Nilai Total Transaksi Masuk : <span className="font-bold text-green-600">{stats?.nilaiTotalTransaksi?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span></p>
                      <p>Nilai Total Transaksi Keluar : <span className="font-bold text-red-600">{stats?.nilaiTotalTransaksiKeluar?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span></p>
                  </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Sampah</h3>
                      <p>Total Jenis Sampah : <span className="font-bold text-indigo-600">{stats?.totalJenisSampah}</span></p>
                       <p>Total Item di Inventory : <span className="font-bold text-indigo-600">{stats?.totalItemInventory}</span></p>
                      <p>Total Kuantitas di Inventory : <span className="font-bold text-indigo-600">{stats?.totalKuantitasInventory}</span></p>
                 </div>
            </div>
        
            {stats && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-2">Perbandingan Transaksi</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                  <BarChart width={730} height={250} data={dataTransaksi}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="total" fill="#8884d8" />
                                  </BarChart>
                             </ResponsiveContainer>
                         </div>
        
                        <div className="bg-white p-4 rounded-lg shadow-md">
                           <h3 className="text-lg font-semibold mb-2">Jenis Sampah Terbanyak</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                     <PieChart width={400} height={400} >
                                      <Pie
                                        dataKey="total"
                                        isAnimationActive={false}
                                       data={dataSampah}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    />
                                      <Tooltip />
                                      <Legend />
                                      </PieChart>
                                  </ResponsiveContainer>
                          </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Item Terbanyak di Inventory</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart width={400} height={400} >
                                        <Pie
                                        dataKey="total"
                                        isAnimationActive={false}
                                        data={dataInventory}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                     />
                                     <Tooltip />
                                     <Legend />
                                    </PieChart>
                                 </ResponsiveContainer>
                            </div>

                    </div>
           )}
          
        </div>
    );
};

export default AdminDashboard;