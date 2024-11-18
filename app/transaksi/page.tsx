"use client";

import { useEffect, useState } from "react";
import axios from "axios";
// import { useRouter } from "next/router=";
import { useSearchParams, useRouter } from "next/navigation";

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
  const [transaksi, setTransaksi] = useState<Transaksi[]>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialParam = searchParams.get("tipe") || "";
  const [tipeTransaksi, setTipeTransaksi] = useState(initialParam);

  useEffect(() => {
    const fetchData = async () => {
      console.log(tipeTransaksi);
      const token = localStorage.getItem("token");
      const { data } = await axios.get<Transaksi[]>("http://localhost:5000/api/transaksi/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tipe_transaksi: tipeTransaksi,
        },
      });

      setTransaksi(data);
    };

    if (tipeTransaksi === "masuk" || tipeTransaksi === "keluar" || tipeTransaksi === "") {
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

  return (
    <>
      <button
        onClick={() => {
          updateQueryParam("");
        }}
      >
        Semua
      </button>

      <button
        onClick={() => {
          updateQueryParam("masuk");
        }}
      >
        Masuk
      </button>
      <button
        onClick={() => {
          updateQueryParam("keluar");
        }}
      >
        Keluar
      </button>

      {transaksi?.map((t) => {
        return (
          <>
            <div key={t.transaksi_id}>
              <p>Id : {t.transaksi_id}</p>
              <p>{t.tanggal}</p>
              <p>Tipe : {t.tipe_transaksi}</p>

              {t.transaksiSampah.map((ts, i) => {
                return (
                  <div key={ts.harga_id}>
                    <p>{i + 1}.</p>
                    <p>{ts.nama_sampah}</p>
                    <p>{ts.jumlah_sampah}x</p>
                    <p>Harga : {ts.harga_sampah}</p>
                    <p>Total Harga : {ts.harga_sampah * ts.jumlah_sampah}</p>
                  </div>
                );
              })}
            </div>

            <br />
          </>
        );
      })}
    </>
  );
}
