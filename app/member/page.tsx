// /app/member/page.tsx

"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatToRupiah } from '@/utils/formatter';
import { getToken } from '@/utils/getToken';
import Image from 'next/image';

type Sampah = {
    sampah_id: number;
    nama_sampah: string;
    url_gambar: string;
    harga_sampah: number;
    nama_suk: string;
}
type Setoran = {
    transaksi_masuk_id: number;
    tanggal: string;
    transaksiSampah: TransaksiSampah[];
    pengguna_id: number
}

type TransaksiSampah = {
    sampah_id: number;
    nama_sampah: string;
    jumlah_sampah: number;
    harga_sampah: number;
}

export default function ClientDashboard() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSampah, setSelectedSampah] = useState<Sampah | null>(null);
    const [sampahList, setSampahList] = useState<Sampah[]>([]);
    const [setoranList, setSetoranList] = useState<Setoran[]>([]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };
    const handleShowSampahDetail = (sampah: Sampah) => {
        setSelectedSampah(sampah);
        setIsModalOpen(true)
    }
    //fetch daftar sampah
    useEffect(() => {
        const fetchSampah = async () => {
          try {
            const response = await axios.get<Sampah[]>("http://localhost:5000/api/sampah");
            setSampahList(response.data);
          } catch (error) {
            console.error("Failed to fetch sampah:", error);
          }
        };

        fetchSampah();
      }, []);

    //fetch riwayat setoran
    useEffect(() => {
      const fetchSetoran = async () => {
        try {
          const response = await axios.get<Setoran[]>("http://localhost:5000/api/transaksi/masuk",
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
          );
          setSetoranList(response.data);
        } catch (error) {
            console.error("Failed to fetch setoran", error);
        }
      }

        fetchSetoran();
    }, [])
    return (
      <>
        {/* Header */}
        <header className="bg-green-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Client Dashboard</h1>
            <nav className="space-x-4">
              <a href="/" className="hover:text-green-300">Beranda</a>
              <a href="#purchase-prices" className="hover:text-green-300">Harga Pembelian</a>
              <a href="#deposit-history" className="hover:text-green-300">Riwayat Deposit</a>
              <a href="#income-report" className="hover:text-green-300">Laporan Pendapatan</a>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >Logout</button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-10">
          <section id="purchase-prices" className="mb-20">
            <h2 className="text-2xl font-bold mb-4">Daftar Sampah</h2>
            {/* Daftar Sampah */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampahList.map((sampah) => (
                    <div key={sampah.sampah_id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <Image src={`http://localhost:5000/${sampah.url_gambar}`} alt={sampah.nama_sampah} width={200} height={160} className="w-full h-40 object-cover rounded-md mb-2"/>
                            <h3 className="text-lg font-medium text-gray-800 mb-1">{sampah.nama_sampah}</h3>
                           <p className="text-gray-600">Harga : {formatToRupiah(sampah.harga_sampah)}</p>
                        </div>
                      <button
                        className="btn mt-2 self-end"
                        onClick={() => handleShowSampahDetail(sampah)}
                      >Lihat Detail</button>
                    </div>
                ))}
            </div>
          </section>

            {/* MODAL DETAIL */}
            {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-gray-100 p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">{selectedSampah?.nama_sampah}</h2>
                        <button
                           onClick={() => setIsModalOpen(false)}
                           className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            ✕
                         </button>
                        </div>
                        <div className="p-6">
                        {selectedSampah &&
                        (
                            <>
                                 <Image src={`http://localhost:5000/${selectedSampah.url_gambar}`} alt={selectedSampah.nama_sampah} width={300} height={240} className="w-full h-60 object-cover rounded-md mb-4"/>
                                 <p>Nama : {selectedSampah.nama_sampah}</p>
                                <p>Harga: {formatToRupiah(selectedSampah.harga_sampah)}</p>
                             </>

                        )}
                        </div>
                    </div>
                </div>
           )}
           {/* END MODAL */}

          <section id="deposit-history" className="mb-20">
            <h2 className="text-2xl font-bold mb-4">Riwayat Deposit Limbah</h2>
                {/* Riwayat Setoran */}
                 <div className="space-y-4">
                    {setoranList.map((setoran) => (
                        <div key={setoran.transaksi_masuk_id} className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="font-bold text-gray-800">Transaksi ID: {setoran.transaksi_masuk_id}</h3>
                                <p className="text-gray-600">Tanggal: {setoran.tanggal}</p>
                                <div className="mt-2">
                                  <h4 className="font-semibold text-gray-700">Detail Sampah:</h4>
                                    <ul className="list-disc list-inside">
                                         {setoran.transaksiSampah.map((s) => (
                                         <li key={s.sampah_id} className="text-gray-600">
                                            {s.nama_sampah} ({formatToRupiah(s.harga_sampah)}) x {s.jumlah_sampah}
                                         </li>
                                      ))}
                                  </ul>
                                </div>
                                 <p className="mt-2 font-semibold text-green-600">Total: {formatToRupiah(setoran.transaksiSampah.reduce((total, item) => total + (item.jumlah_sampah * item.harga_sampah), 0))}</p>
                        </div>
                    ))}
                 </div>

          </section>

          <section id="income-report">
            <h2 className="text-2xl font-bold mb-4">Laporan Masukan</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">Total pendapatan dari deposit limbah: <strong>Rp. 1500</strong></p>
              <p className="mb-4">Pendapatan dari deposit pada Januari 2023:</p>
              <ul className="list-disc list-inside">
                <li>Plastic: Rp. 1000</li>
                <li>Glass: Rp. 500</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            © 2024 Sistem Informasi Bank Sampah. All rights reserved.
          </div>
        </footer>
      </>
    );
  }