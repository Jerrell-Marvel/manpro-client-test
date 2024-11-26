"use client";

import Line from "@/app/components/Line";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, X, Check } from "lucide-react";

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
};

function TambahTransaksiPage() {
  const router = useRouter();
  const [penggunaList, setPenggunaList] = useState<Pengguna[]>([]);
  const [filteredPengguna, setFilteredPengguna] = useState<Pengguna[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Pengguna | null>(null);

  const [sampah, setSampah] = useState<Sampah[]>([]);
  const [filteredSampah, setFilteredSampah] = useState<Sampah[]>([]);
  const [sampahSearchQuery, setSampahSearchQuery] = useState<string>("");
  const [isSampahModalOpen, setIsSampahModalOpen] = useState<boolean>(false);

  const [transaksi, setTransaksi] = useState<{ sampahId: number; jumlahSampah: number; namaSampah: string; hargaSampah: number }[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pengguna
        const { data: penggunaData } = await axios.get<Pengguna[]>("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setPenggunaList(penggunaData);

        // Sampah
        const { data: dataSampah } = await axios.get<Sampah[]>("http://localhost:5000/api/sampah");
        setSampah(dataSampah);
        setFilteredSampah(dataSampah);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter pengguna based on search query
  const filterPengguna = (query: string) => {
    const filtered = penggunaList.filter((item) => 
      item.nama.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPengguna(filtered);
  };

  // Filter sampah based on search query
  const filterSampah = (query: string) => {
    const filtered = sampah.filter((s) => 
      s.nama_sampah.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSampah(filtered);
  };

  // Handle submit transaction
  const handleSubmit = async () => {
    if (!selectedUser) {
      alert("Pilih pengguna terlebih dahulu");
      return;
    }

    if (transaksi.length === 0) {
      alert("Tambahkan sampah terlebih dahulu");
      return;
    }

    const invalidTransaksi = transaksi.some(t => t.jumlahSampah <= 0);
    if (invalidTransaksi) {
      alert("Jumlah sampah harus lebih dari 0");
      return;
    }

    try {
      const sendTransaksi = transaksi.map((t) => ({
        sampahId: t.sampahId, 
        jumlahSampah: t.jumlahSampah
      }));

      await axios.post(
        "http://localhost:5000/api/transaksi/masuk",
        {
          penggunaId: selectedUser.pengguna_id,
          transaksiSampah: sendTransaksi,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Redirect after successful submission
      router.push("/admin/transaksi/masuk");
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Gagal menyimpan transaksi");
    }
  };

  // Calculate total transaction value
  const calculateTotal = () => {
    return transaksi.reduce((total, item) => total + (item.jumlahSampah * item.hargaSampah), 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Transaksi</h1>
      </header>

      {/* User Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Pilih Pengguna</label>
        <div className="relative">
          <div className="flex items-center bg-white border rounded-lg">
            <Search size={20} className="ml-3 text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama pengguna..."
              value={userSearchQuery}
              onChange={(e) => {
                setUserSearchQuery(e.target.value);
                filterPengguna(e.target.value);
              }}
              className="w-full p-3 pl-2 rounded-lg focus:outline-none"
            />
            {selectedUser && (
              <button 
                onClick={() => setSelectedUser(null)} 
                className="mr-3 text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* User Dropdown */}
          {filteredPengguna.length > 0 && !selectedUser && (
            <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {filteredPengguna.map((item) => (
                <li
                  key={item.pengguna_id}
                  onClick={() => {
                    setSelectedUser(item);
                    setUserSearchQuery(item.nama);
                    setFilteredPengguna([]);
                  }}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                >
                  {item.nama}
                </li>
              ))}
            </ul>
          )}

          {/* Selected User Display */}
          {selectedUser && (
            <div className="mt-2 bg-green-50 p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-800">{selectedUser.nama}</p>
                <p className="text-green-600 text-sm">{selectedUser.email}</p>
              </div>
              <Check size={24} className="text-green-600" />
            </div>
          )}
        </div>
      </div>

      {/* Add Sampah Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsSampahModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusCircle size={20} />
          Tambah Sampah
        </button>
      </div>

      {/* Sampah Transaction Table */}
      {transaksi.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                {["Nama Sampah", "Harga Satuan", "Jumlah", "Subtotal"].map((header) => (
                  <th key={header} className="p-4 text-left text-gray-600 font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transaksi.map((t, i) => (
                <tr key={t.sampahId} className="border-b hover:bg-gray-50">
                  <td className="p-4">{t.namaSampah}</td>
                  <td className="p-4">{t.hargaSampah.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="1"
                      value={t.jumlahSampah}
                      onChange={(e) => {
                        const newTransaksi = [...transaksi];
                        newTransaksi[i].jumlahSampah = Number(e.target.value);
                        setTransaksi(newTransaksi);
                      }}
                      className="w-20 p-2 border rounded-md"
                    />
                  </td>
                  <td className="p-4">
                    {(t.jumlahSampah * t.hargaSampah).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td colSpan={3} className="p-4 text-right font-semibold">Total</td>
                <td className="p-4 font-bold text-green-700">
                  {calculateTotal().toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Save Button */}
      {selectedUser && transaksi.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Simpan Transaksi
          </button>
        </div>
      )}

      {/* Sampah Modal */}
      {isSampahModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gray-100 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Pilih Sampah</h2>
              <button 
                onClick={() => setIsSampahModalOpen(false)} 
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={sampahSearchQuery}
                  onChange={(e) => {
                    setSampahSearchQuery(e.target.value);
                    filterSampah(e.target.value);
                  }}
                  placeholder="Cari sampah..."
                  className="w-full p-3 pl-10 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                <ul className="space-y-2">
                  {filteredSampah.map((s) => (
                    <li
                      key={s.sampah_id}
                      onClick={() => {
                        // Check if sampah already exists in transaksi
                        const existingSampahIndex = transaksi.findIndex(t => t.sampahId === s.sampah_id);
                        
                        if (existingSampahIndex === -1) {
                          setTransaksi([
                            { 
                              sampahId: s.sampah_id, 
                              jumlahSampah: 1, 
                              namaSampah: s.nama_sampah,
                              hargaSampah: s.harga_sampah 
                            },
                            ...transaksi
                          ]);
                        }

                        setIsSampahModalOpen(false);
                        setSampahSearchQuery("");
                      }}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{s.nama_sampah}</p>
                        <p className="text-gray-600">{s.nama_suk}</p>
                        <p className="text-gray-600 text-sm">
                          Harga: {s.harga_sampah.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TambahTransaksiPage;