"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { getToken } from "@/utils/getToken";
import { formatToRupiah } from "@/utils/formatter";
import { PlusCircle, Eye, CalendarRange } from "lucide-react";

import Line from "@/app/components/Line";

type TransaksiSampah = {
  sampah_id: number;
  harga_id: number;
  jumlah_sampah: number;
  nama_sampah: string;
  jenis_sampah_id: number;
  url_gambar: string;
  suk_id: number;
  is_active: boolean;
  harga_id_sekarang: number;
  nama_suk: string;
  tanggal_ubah: string;
  harga_sampah: number;
};

type TransaksiMasuk = {
  transaksi_masuk_id: number;
  tanggal: string;
  pengguna_id: number;
  transaksiSampah: TransaksiSampah[];
};

export default function TransaksiMasuk() {
  const [transaksi, setTransaksi] = useState<TransaksiMasuk[]>();
  const [selectedTransaksiSampah, setSelectedTransaksiSampah] = useState<TransaksiSampah[]>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState<string | null>(searchParams.get("start"));
  const [endDate, setEndDate] = useState<string | null>(searchParams.get("end"));

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<TransaksiMasuk[]>("http://localhost:5000/api/transaksi/masuk/all", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: {
          start: startDate,
          end: endDate,
        },
      });

      setTransaksi(data);
    };

    fetchData();
  }, [startDate, endDate]);

  const updateQueryParam = (params: { start?: string; end?: string }) => {
    const currentParams = new URLSearchParams(searchParams);
    if (params.start) {
      currentParams.set("start", params.start);
    }
    if (params.end) {
      currentParams.set("end", params.end);
    }

    router.push(`?${currentParams.toString()}`);
  };

  const calculateTotal = (transaksiSampah: TransaksiSampah[]): number => {
    let total = 0;
    transaksiSampah.forEach((ts) => {
      total += ts.jumlah_sampah * ts.harga_sampah;
    });
    return total;
  };

  return (
    <div className="container mx-auto px-4 py-6">
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
                      <p className="text-gray-600">{sampah.nama_suk}</p>
                      <p className="text-gray-600">Jumlah: {sampah.jumlah_sampah}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Subtotal</p>
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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Transaksi Setoran Sampah</h1>
        <button 
          onClick={() => router.push("/admin/transaksi/masuk/tambah")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusCircle size={20} />
          Tambah Transaksi
        </button>
      </div>

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
                  setStartDate(e.target.value);
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
                  setEndDate(e.target.value);
                  updateQueryParam({ end: e.target.value });
                }}
                className="text-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              {["ID Transaksi", "Member", "Nilai Total", "Tanggal", "Aksi"].map((header) => (
                <th key={header} className="p-4 text-left text-gray-600 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transaksi?.map((t) => (
              <tr key={t.transaksi_masuk_id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-800">{t.transaksi_masuk_id}</td>
                <td className="p-4 text-gray-800">{t.pengguna_id}</td>
                <td className="p-4 font-semibold text-green-700">
                  {formatToRupiah(calculateTotal(t.transaksiSampah))}
                </td>
                <td className="p-4 text-gray-600">{t.tanggal}</td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedTransaksiSampah(t.transaksiSampah)}
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
    </div>
  );
}