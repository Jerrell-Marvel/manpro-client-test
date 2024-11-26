"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { getToken } from "@/utils/getToken";

type TransaksiSampah = {
  sampah_id: number;
  harga_id: number;
  jumlah_sampah: number;
  nama_sampah: string;
  jenis_sampah_id: number;
  url_gambar: string;
  suk_id: number;
  nama_suk: string;
  is_active: boolean;
  harga_sampah: number;
};

type Transaksi = {
  transaksi_id: number;
  tanggal: string;
  tipe_transaksi: string;
  pengguna_id: number;
  bs_pusat_id: number;
  transaksiSampah: TransaksiSampah[];
};

export default function Transaksi() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [tipeTransaksi, setTipeTransaksi] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialParam = searchParams.get("tipe") || "";
    setTipeTransaksi(initialParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<Transaksi[]>("http://localhost:5000/api/transaksi/all", {
          headers: { Authorization: `Bearer ${getToken()}` },
          params: { tipe_transaksi: tipeTransaksi },
        });
        setTransaksi(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (["masuk", "keluar", ""].includes(tipeTransaksi)) {
      fetchData();
    }
  }, [tipeTransaksi]);

  const updateQueryParam = (newParam: string) => {
    setTipeTransaksi(newParam);

    const currentParams = new URLSearchParams(searchParams);
    if (newParam) {
      currentParams.set("tipe", newParam);
    } else {
      currentParams.delete("tipe");
    }
    router.push(`?${currentParams.toString()}`);
  };

  const handlePindahBtnClick = async (transaksiId: number) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/transaksi/${transaksiId}`,
        { tipeTransaksi: "keluar" },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setTransaksi((prev) => prev.filter((t) => t.transaksi_id !== transaksiId));
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="p-4">

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => updateQueryParam("")}
          className={`px-4 py-2 rounded ${
            tipeTransaksi === "" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => updateQueryParam("masuk")}
          className={`px-4 py-2 rounded ${
            tipeTransaksi === "masuk" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Masuk
        </button>
        <button
          onClick={() => updateQueryParam("keluar")}
          className={`px-4 py-2 rounded ${
            tipeTransaksi === "keluar" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Keluar
        </button>
      </div>

      {transaksi.map((t) => (
        <div key={t.transaksi_id} className="border p-4 rounded shadow-sm mb-4">
          <p className="font-semibold">Id: {t.transaksi_id}</p>
          <p>Tanggal: {t.tanggal}</p>
          <p>Tipe: {t.tipe_transaksi}</p>

          <div className="mt-4 space-y-2">
            {t.transaksiSampah.map((ts, i) => (
              <div key={ts.harga_id} className="border-b pb-2">
                <p>{i + 1}. {ts.nama_sampah}</p>
                <p>Jumlah: {ts.jumlah_sampah}</p>
                <p>Harga: {ts.harga_sampah}</p>
                <p>Total: {ts.harga_sampah * ts.jumlah_sampah}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => handlePindahBtnClick(t.transaksi_id)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
          >
            Pindahkan ke transaksi keluar
          </button>
        </div>
      ))}
    </div>
  );
}
