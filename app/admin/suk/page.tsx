"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

type Suk = {
  suk_id: number;
  nama_suk: string;
  is_active: boolean;
};

export default function SukPage() {
  const [suk, setSuk] = useState<Suk[]>([]);
  const [namaSuk, setNamaSuk] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/suk");
        setSuk(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post<{ suk_id: number }>(
        "http://localhost:5000/api/suk",
        { namaSUK: namaSuk },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Masukan item ke list
      setSuk((prev) => [
        {
          suk_id: data.suk_id,
          nama_suk: namaSuk,
          is_active: true,
        },
        ...prev,
      ]);

      // Clear input field
      setNamaSuk("");
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
          Tambah Suk
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="nama-suk"
            value={namaSuk}
            onChange={(e) => setNamaSuk(e.target.value)}
            className="border border-gray-300 rounded p-2 flex-1"
            placeholder="Masukkan nama SUK"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </form>
      <h3 className="text-lg font-semibold mb-4">Suk Tersedia</h3>
      <div className="space-y-2">
        {suk.map((s) => (
          <div
            key={s.suk_id}
            className="p-3 border rounded shadow-sm bg-white hover:shadow-md"
          >
            {s.nama_suk}
          </div>
        ))}
      </div>
    </div>
  );
}
