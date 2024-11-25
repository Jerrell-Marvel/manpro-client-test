"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

type JenisSampah = {
  jenis_sampah_id: number;
  nama_jenis_sampah: string;
  is_active: boolean;
};

export default function JenisSampahPage() {
  const [jenisSampah, setJenisSampah] = useState<JenisSampah[]>([]);
  const [namaJenis, setNamaJenis] = useState<string>("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/jenis-sampah");
        setJenisSampah(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post<{ suk_id: number }>(
        "http://localhost:5000/api/jenis-sampah",
        { namaJenisSampah: namaJenis },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Menambah item baru
      setJenisSampah((prev) => [
        {
          jenis_sampah_id: data.suk_id,
          nama_jenis_sampah: namaJenis,
          is_active: true,
        },
        ...prev,
      ]);

      // Clear input field
      setNamaJenis("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} className="mb-6">
        <label
          htmlFor="nama-suk"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tambah Jenis Sampah
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="nama-suk"
            value={namaJenis}
            onChange={(e) => setNamaJenis(e.target.value)}
            className="border border-gray-300 rounded p-2 flex-1"
            placeholder="Masukkan nama jenis sampah"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Save
          </button>
        </div>
      </form>
      <h3 className="text-lg font-semibold mb-4">Jenis Sampah Tersedia</h3>
      <div className="space-y-2">
        {jenisSampah.map((js) => (
          <div
            key={js.jenis_sampah_id}
            className="p-3 border rounded shadow-sm bg-white hover:shadow-md"
          >
            {js.nama_jenis_sampah}
          </div>
        ))}
      </div>
    </div>
  );
}
