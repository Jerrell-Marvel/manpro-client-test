"use client";

import { useEffect, useState } from "react";
import axios from "axios";
// import { useRouter } from "next/router=";
import { useSearchParams, useRouter } from "next/navigation";
import { getToken } from "@/utils/getToken";
import { formatToRupiah } from "@/utils/formatter";

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

    console.log("HEREREHERHEH");
  };

  //   const handlePindahBtnClick = async (transaksiId: number) => {
  //     await axios.patch(
  //       `http://localhost:5000/api/transaksi/${transaksiId}`,
  //       {
  //         tipeTransaksi: "keluar",
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${getToken()}`,
  //         },
  //       }
  //     );

  // const newTransaksi = transaksi?.filter((t) => t.transaksi_id != transaksiId);

  // setTransaksi(newTransaksi);
  //   };

  const calculateTotal = (transaksiSampah: TransaksiSampah[]): number => {
    let total = 0;
    transaksiSampah.forEach((ts) => {
      total += ts.jumlah_sampah * ts.harga_sampah;
    });
    return total;
  };

  return (
    <>
      {/* START MODAL */}
      {selectedTransaksiSampah ? (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="max-h-[80vh] w-1/2 bg-white rounded-lg overflow-y-scroll relative overflow-x-hidden pb-6">
              <div className="sticky top-0 bg-white p-6 flex justify-between items-center">
                <h2 className="text-2xl">Detail transaksi</h2>

                <button onClick={() => setSelectedTransaksiSampah(undefined)}>X</button>
              </div>

              <Line />

              <ul className="p-6 flex flex-col gap-4">
                {selectedTransaksiSampah.map((sampah) => {
                  return (
                    <li
                      key={sampah.sampah_id}
                      className="rounded-md p-4 bg-slate-100"
                    >
                      <div className="grid grid-cols-2">
                        <div>
                          <p>{sampah.nama_sampah}</p>
                          <p>{sampah.nama_suk}</p>
                        </div>
                        <div>
                          <p>Subtotal : </p>
                          <p>{sampah.harga_sampah * sampah.jumlah_sampah}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="px-10 grid grid-cols-2">
                <p>Total Transaksi : </p>
                <p>{calculateTotal(selectedTransaksiSampah)}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {/* END MODAL */}

      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaksi Setoran Sampah</h1>
      </header>

      <div className="bg-white shadow-md rounded-lg mt-6">
        <div className="flex gap-4 mb-6 items-center">
          <input
            type="date"
            id="date-start"
            value={startDate || ""}
            onChange={(e) => {
              setStartDate(e.target.value);
              updateQueryParam({ start: e.target.value });
            }}
            className="p-1"
          />
          <p>Sampai</p>
          {/* <label htmlFor="date-end">Tanggal Selesai</label> */}
          <input
            type="date"
            id="date-end"
            value={endDate || ""}
            onChange={(e) => {
              setEndDate(e.target.value);
              updateQueryParam({ end: e.target.value });
            }}
            className="p-1"
          />
        </div>
        {/* <label htmlFor="date-start">Tanggal Mulai</label> */}

        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">ID Transaksi</th>
              <th className="p-3 text-left">Member</th>
              <th className="p-3 text-left">Nilai Total</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksi?.map((t) => {
              return (
                <>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="p-3">{t.transaksi_masuk_id}</td>
                    <td
                      className="p-3"
                      x-text="transaction.memberName"
                    >
                      {t.pengguna_id}
                    </td>

                    <td className="p-3">{formatToRupiah(calculateTotal(t.transaksiSampah))}</td>
                    <td className="p-3">{t.tanggal}</td>

                    <td className="p-3">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        onClick={() => setSelectedTransaksiSampah(t.transaksiSampah)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
