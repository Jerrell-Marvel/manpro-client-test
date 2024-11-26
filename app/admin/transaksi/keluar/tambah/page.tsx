"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";
import { useRouter } from "next/navigation";
import { PlusCircle, X, Search, Save } from "lucide-react";

import Line from "@/app/components/Line";

type Sampah = {
  sampah_id: number;
  nama_sampah: string;
  jenis_sampah_id: number;
  url_gambar: string;
  suk_id: number;
  is_active: boolean;
  harga_id_sekarang: number;
  nama_jenis_sampah: string;
  nama_suk: string;
  harga_id: number;
  tanggal_ubah: string;
  harga_sampah: number;
  inventory_sampah_id: number;
  kuantitas: number;
};

type TransaksiItem = {
  sampahId: number;
  jumlahSampah: number;
  kuantitasInventory: number;
  nama: string;
};

export default function TransaksiKeluarTambahPage() {
  const router = useRouter();
  const [sampah, setSampah] = useState<Sampah[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSampah, setFilteredSampah] = useState<Sampah[]>([]);
  const [isSampahModalOpen, setIsSampahModalOpen] = useState<boolean>(false);
  const [transaksi, setTransaksi] = useState<TransaksiItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dataSampah } = await axios.get<Sampah[]>("http://localhost:5000/api/sampah", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        setSampah(dataSampah);
        setFilteredSampah(dataSampah);
      } catch (error) {
        console.error("Error fetching sampah data:", error);
        // TODO: Add proper error handling (e.g., toast notification)
      }
    };

    fetchData();
  }, []);

  const filterSampah = (sampahSearchQuery: string, sampahList: Sampah[]) => {
    const filtered = sampahList.filter((s) => 
      sampahSearchQuery === "" || 
      s.nama_sampah.toLowerCase().includes(sampahSearchQuery.toLowerCase())
    );

    setFilteredSampah(filtered);
  };

  const handleSubmit = async () => {
    try {
      const sendTransaksi = transaksi.map((t) => ({
        sampahId: t.sampahId, 
        jumlahSampah: t.jumlahSampah
      }));

      await axios.post(
        "http://localhost:5000/api/transaksi/keluar",
        {
          bsPusatId: 2,
          transaksiSampah: sendTransaksi,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Redirect after successful submission
      router.push("/admin/transaksi/keluar");
    } catch (error) {
      console.error("Error submitting transaksi:", error);
      // TODO: Add proper error handling (e.g., toast notification)
    }
  };

  const calculateTotal = () => {
    return transaksi.reduce((total, item) => {
      return total + (item.jumlahSampah || 0);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Transaksi Setoran Sampah Keluar</h1>
        <button 
          onClick={() => router.push("/admin/transaksi/keluar")}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Kembali
        </button>
      </div>

      <Line />

      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6">
          <button
            onClick={() => setIsSampahModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={20} />
            Tambah Sampah
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left text-gray-600 font-semibold">ID Sampah</th>
              <th className="p-4 text-left text-gray-600 font-semibold">Nama Sampah</th>
              <th className="p-4 text-left text-gray-600 font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {transaksi?.map((t, i) => (
              <tr key={t.sampahId} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-800">{t.sampahId}</td>
                <td className="p-4 text-gray-800">{t.nama}</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={t.jumlahSampah}
                      onChange={(e) => {
                        const newTransaksi = [...transaksi];
                        newTransaksi[i].jumlahSampah = Number(e.target.value);
                        setTransaksi(newTransaksi);
                      }}
                      max={t.kuantitasInventory}
                      className="w-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-gray-600">Tersedia: {t.kuantitasInventory}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transaksi.length > 0 && (
          <div className="p-6 border-t flex justify-between items-center">
            <p className="font-semibold text-gray-800">Total Item</p>
            <p className="font-bold text-green-700">{calculateTotal()}</p>
          </div>
        )}

        <div className="p-6 border-t">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} />
            Simpan Transaksi
          </button>
        </div>
      </div>

      {/* Sampah Selection Modal */}
      {isSampahModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gray-100 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Pilih Sampah</h2>
              <button 
                onClick={() => setIsSampahModalOpen(false)} 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <Line />

            <div className="p-6">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    filterSampah(e.target.value, sampah);
                  }}
                  className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Cari sampah"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <ul className="space-y-4 max-h-[50vh] overflow-y-auto">
                {filteredSampah.map((s) => (
                  <li
                    key={s.sampah_id}
                    onClick={() => {
                      setIsSampahModalOpen(false);
                      const newSampah = sampah.filter((samp) => samp.sampah_id !== s.sampah_id);
                      setSampah(newSampah);
                      filterSampah("", newSampah);
                      setSearchQuery("");

                      const newTransaksi: TransaksiItem[] = [
                        { 
                          jumlahSampah: 0, 
                          kuantitasInventory: s.kuantitas, 
                          sampahId: s.sampah_id, 
                          nama: s.nama_sampah 
                        }, 
                        ...transaksi
                      ];
                      setTransaksi(newTransaksi);
                    }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{s.nama_sampah}</p>
                        <p className="text-gray-600">{s.nama_suk}</p>
                      </div>
                      <p className="text-gray-500">Stok: {s.kuantitas}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}