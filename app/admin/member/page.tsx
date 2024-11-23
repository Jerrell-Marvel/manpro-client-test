"use client";

import { getToken } from "@/utils/getToken";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Pengguna = {
  pengguna_id: number;
  password: string;
  no_hp: string;
  alamat: string;
  email: string;
  role: "admin" | "pengguna";
  kel_id: number;
  nama: string;
};

function PenggunaPage() {
  const [penggunaList, setPenggunaList] = useState<Pengguna[]>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<Pengguna[]>("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setPenggunaList(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Data Member</h1>
      </header>

      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Id Pengguna</th>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">email</th>
            <th className="p-3 text-left">No HP</th>
            <th className="p-3 text-left">Alamat</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {penggunaList?.map((pengguna) => {
            return (
              <tr
                className="border-b"
                key={pengguna.pengguna_id}
              >
                <td className="p-3">{pengguna.pengguna_id}</td>
                <td className="p-3">{pengguna.nama}</td>
                <td className="p-3">{pengguna.email}</td>
                <td className="p-3">{pengguna.no_hp}</td>
                <td className="p-3">{pengguna.alamat}</td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/sampah/ubah/${pengguna.pengguna_id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PenggunaPage;
