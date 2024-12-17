"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatToRupiah } from '@/utils/formatter';
import { getToken } from '@/utils/getToken';
import Image from 'next/image';
import { Eye, CalendarRange, Search } from "lucide-react";
import Line from '@/app/components/Line';

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
    const [filteredSampahList, setFilteredSampahList] = useState<Sampah[]>([]);
    const [setoranList, setSetoranList] = useState<Setoran[]>([]);
    const [totalPendapatan, setTotalPendapatan] = useState<number>(0);
    const [pendapatanPerJenis, setPendapatanPerJenis] = useState<{ [jenis: string]: number }>({});
    const [selectedTransaksiSampah, setSelectedTransaksiSampah] = useState<TransaksiSampah[]>();
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

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
            setFilteredSampahList(response.data);
          } catch (error) {
            console.error("Failed to fetch sampah:", error);
          }
        };

        fetchSampah();
      }, []);

      //handle search function
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        
         const filtered = sampahList.filter((sampah) =>
            query === "" ||
            sampah.nama_sampah.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredSampahList(filtered);
     };


    //fetch riwayat setoran
    useEffect(() => {
      const fetchSetoran = async () => {
        try {
          const response = await axios.get<Setoran[]>("http://localhost:5000/api/transaksi/masuk",
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            },
              params: {
              start: startDate,
              end: endDate,
            },
          }
          );
          setSetoranList(response.data);
          calculatePendapatan(response.data);
        } catch (error) {
            console.error("Failed to fetch setoran", error);
        }
      }

        fetchSetoran();
    }, [startDate, endDate])

       //fungsi untuk update query param
       const updateQueryParam = (params: { start?: string; end?: string }) => {
        if (params.start) {
            setStartDate(params.start)
        }
        if (params.end) {
             setEndDate(params.end)
         }
    };
    //fungsi untuk kalkulasi total pendapatan dan per jenis sampah
    const calculatePendapatan = (setoranList: Setoran[]) => {
       let total = 0;
       const perJenis: { [jenis: string]: number } = {};

      for(const setoran of setoranList) {
          for(const sampah of setoran.transaksiSampah) {
            const subtotal = sampah.jumlah_sampah * sampah.harga_sampah
            total += subtotal;
             if (perJenis[sampah.nama_sampah]) {
                perJenis[sampah.nama_sampah] += subtotal;
              } else {
                perJenis[sampah.nama_sampah] = subtotal;
              }
          }
        }

       setTotalPendapatan(total);
       setPendapatanPerJenis(perJenis);

    }
     const calculateTotal = (transaksiSampah: TransaksiSampah[]): number => {
        let total = 0;
        transaksiSampah.forEach((ts) => {
        total += ts.jumlah_sampah * ts.harga_sampah;
        });
        return total;
    };
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
            <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
                <span>Daftar Sampah</span>
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari jenis sampah"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 pl-10 border rounded focus:outline-none"
                      />
                      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

            </h2>
            {/* Daftar Sampah */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSampahList.map((sampah) => (
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

          {/* START MODAL */}
            {selectedTransaksiSampah && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-gray-100 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-800">Detail Transaksi</h2>
                            <button
                                onClick={() => setSelectedTransaksiSampah(undefined)}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <Line />

                        <div className="p-6">
                            <ul className="space-y-4 mb-6">
                                {selectedTransaksiSampah.map((sampah) => (
                                    <li
                                        key={sampah.sampah_id}
                                        className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">{sampah.nama_sampah}</p>
                                            <p className="text-gray-600">Jumlah: {sampah.jumlah_sampah}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{formatToRupiah(sampah.harga_sampah * sampah.jumlah_sampah)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex justify-between border-t pt-4 font-semibold">
                                <p>Total Transaksi</p>
                                <p>{formatToRupiah(calculateTotal(selectedTransaksiSampah))}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* END MODAL */}


          <section id="deposit-history" className="mb-20">
            <h2 className="text-2xl font-bold mb-4">Riwayat Deposit Limbah</h2>
              <div className="bg-white shadow-md rounded-lg">
                <div className="p-6 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
                      <CalendarRange size={20} className="text-gray-500" />
                      <input
                        type="date"
                        id="date-start"
                        value={startDate || ""}
                          onChange={(e) => {
                            updateQueryParam({ start: e.target.value });
                           }}
                        className="text-gray-700 focus:outline-none"
                      />
                    </div>
                    <p className="text-gray-600">Sampai</p>
                    <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
                      <CalendarRange size={20} className="text-gray-500" />
                      <input
                        type="date"
                        id="date-end"
                           value={endDate || ""}
                          onChange={(e) => {
                            updateQueryParam({ end: e.target.value });
                           }}
                        className="text-gray-700 focus:outline-none"
                      />
                    </div>
                </div>
            </div>
              {/* Riwayat Setoran */}
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-4 text-left text-gray-600 font-semibold">ID Transaksi</th>
                        <th className="p-4 text-left text-gray-600 font-semibold">Tanggal</th>
                        <th className="p-4 text-left text-gray-600 font-semibold">Total</th>
                         <th className="p-4 text-left text-gray-600 font-semibold">Aksi</th>
                    </tr>
                </thead>
               <tbody>
                    {setoranList.map((setoran) => (
                        <tr key={setoran.transaksi_masuk_id} className="border-b hover:bg-gray-50">
                            <td className="p-4 text-gray-800">{setoran.transaksi_masuk_id}</td>
                            <td className="p-4 text-gray-600">{setoran.tanggal}</td>
                            <td className="p-4 text-green-600 font-semibold">{formatToRupiah(calculateTotal(setoran.transaksiSampah))}</td>
                            <td className="p-4 text-gray-600">
                                 <button
                                    onClick={() => setSelectedTransaksiSampah(setoran.transaksiSampah)}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
                                >
                                 <Eye size={16} />
                                 Detail
                            </button>
                            </td>
                        </tr>
                     ))}
                 </tbody>
             </table>
             </div>

          </section>

          <section id="income-report">
            <h2 className="text-2xl font-bold mb-4">Laporan Masukan</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">Total pendapatan dari deposit limbah: <strong>{formatToRupiah(totalPendapatan)}</strong></p>
              <p className="mb-4">Pendapatan dari deposit berdasarkan jenis sampah:</p>
              <ul className="list-disc list-inside">
                {Object.entries(pendapatanPerJenis).map(([jenis, total]) => (
                  <li key={jenis}>
                    {jenis}: {formatToRupiah(total)}
                  </li>
                ))}
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