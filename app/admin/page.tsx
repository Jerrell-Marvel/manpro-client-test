"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard: React.FC = () => {
  const [jenisSampahCount, setJenisSampahCount] = useState(0);
  const [sampahCount, setSampahCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Function to get the Bearer token (adjust according to where you store it)
  const getToken = () => {
    return localStorage.getItem("authToken") || ""; // Adjust based on how the token is stored
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const jenisSampahResponse = await axios.get(
          "http://localhost:5000/api/jenis-sampah",
          { headers }
        );
        setJenisSampahCount(jenisSampahResponse.data.length);

        const sampahResponse = await axios.get("http://localhost:5000/api/sampah", { headers });
        setSampahCount(sampahResponse.data.length);

        const membersResponse = await axios.get("http://localhost:5000/api/users", { headers });
        console.log("lihat");
        console.log(membersResponse.data);
        setMembersCount(membersResponse.data.length);

        const transactionsResponse = await axios.get("http://localhost:5000/api/transaksi", { headers });
        setRecentTransactions(transactionsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of the system's data and activity</p>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Metrics Cards */}
        <div className="p-6 bg-green-100 border-l-4 border-green-600 rounded shadow">
          <h2 className="text-lg font-semibold">Jenis Sampah</h2>
          <p className="text-2xl font-bold">{jenisSampahCount}</p>
        </div>
        <div className="p-6 bg-blue-100 border-l-4 border-blue-600 rounded shadow">
          <h2 className="text-lg font-semibold">Sampah</h2>
          <p className="text-2xl font-bold">{sampahCount}</p>
        </div>
        <div className="p-6 bg-yellow-100 border-l-4 border-yellow-600 rounded shadow">
          <h2 className="text-lg font-semibold">Pengguna</h2>
          <p className="text-2xl font-bold">{membersCount}</p>
        </div>
        <div className="p-6 bg-red-100 border-l-4 border-red-600 rounded shadow">
          <h2 className="text-lg font-semibold">Transaksi</h2>
          <p className="text-2xl font-bold">{recentTransactions.length}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Total Transaksi</h2>
        {recentTransactions.length > 0 ? (
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Transaction ID</th>
                <th className="text-left p-4">Member</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction: any, index: number) => (
                <tr
                  key={index}
                  className={`border-t ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="p-4">{transaction.id}</td>
                  <td className="p-4">{transaction.memberName}</td>
                  <td className="p-4">{transaction.amount}</td>
                  <td className="p-4">{new Date(transaction.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">-</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
