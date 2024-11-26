"use client";
import { formatToRupiah } from "@/utils/formatter";
import { getToken } from "@/utils/getToken";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

type SampahInventory = {
  inventory_sampah_id: number;
  sampah_id: number;
  kuantitas: number;
  nama_sampah: string;
  jenis_sampah_id: number;
  url_gambar: string;
  suk_id: number;
  is_active: boolean;
  harga_id_sekarang: number;
  harga_id: number;
  tanggal_ubah: string;
  harga_sampah: number;
  nama_suk: string;
};

function InventoryPage() {
  const [inventory, setInventory] = useState<SampahInventory[]>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<SampahInventory[]>("http://localhost:5000/api/sampah", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setInventory(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Inventory</h1>
      </header>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Id Sampah</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">SUK</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-left">Tersedia</th>
            </tr>
          </thead>
          <tbody>
            {inventory?.map((sampah) => {
              return (
                <tr
                  className="border-b"
                  key={sampah.sampah_id}
                >
                  <td className="p-3">{sampah.sampah_id}</td>
                  <td className="p-3">{sampah.nama_sampah}</td>
                  <td className="p-3">{sampah.nama_suk}</td>
                  <td className="p-3">{formatToRupiah(sampah.harga_sampah)}</td>
                  <td className="p-3">{sampah.kuantitas}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default InventoryPage;
