"use client";

import Line from "@/app/components/Line";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

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

function TambahTransaksiPage() {
  const [penggunaList, setPenggunaList] = useState<Pengguna[]>([]);
  const [filteredPengguna, setFilteredPengguna] = useState<Pengguna[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<number>();

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<Pengguna[]>("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        setPenggunaList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterPengguna = (searchQuery: string) => {
    const filtered = penggunaList.filter((item) => {
      if (searchQuery === "") {
        return true;
      } else {
        return item.nama.toLowerCase().includes(searchQuery.toLowerCase());
      }
    });

    console.log(filtered);
    setFilteredPengguna(filtered);
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Tambah Transaksi</h1>
      </header>

      <Line />

      <div>
        <label htmlFor="">Pilih Pengguna</label>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            filterPengguna(e.target.value);
          }}
          className="inp"
          onFocus={(e) => filterPengguna(e.target.value)}
        />

        {filteredPengguna.length !== 0 ? (
          <>
            <div className="relative">
              <ul className="absolute top-0 pt-2 w-full flex flex-col gap-[3px] bg-slate-100">
                {filteredPengguna.map((item) => (
                  <li
                    key={item.pengguna_id}
                    onClick={(e) => {
                      setSearchQuery(item.nama);
                      setFilteredPengguna([]);
                      setSelectedUser(item.pengguna_id);
                    }}
                    className="cursor-pointer bg-white rounded-md p-4"
                  >
                    {item.nama}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default TambahTransaksiPage;
