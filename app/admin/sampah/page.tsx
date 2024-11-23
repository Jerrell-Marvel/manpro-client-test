"use client";

import { formatToRupiah } from "@/utils/formatter";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

type Sampah = {
  sampah_id: number;
  nama_sampah: string;
  url_gambar: string;
  harga_sampah: number;
  nama_suk: string;
};

const SampahPage = () => {
  const [sampahList, setSampahList] = useState<Sampah[]>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<Sampah[]>("http://localhost:5000/api/sampah");
      setSampahList(data);
    };
    fetchData();
  }, []);

  const handleDeleteClick = async (sampahId: number) => {
    const { data } = await axios.delete(`http://localhost:5000/api/sampah/${sampahId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const newSampahList = sampahList?.filter((sampah) => sampah.sampah_id != sampahId);
    setSampahList(newSampahList);
  };

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Jenis Sampah</h1>
        <Link
          className="btn"
          href="/admin/sampah/tambah"
        >
          Tambahkan Jenis Sampah Baru
        </Link>
      </header>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {sampahList?.map((sampah) => {
              return (
                <tr
                  className="border-b"
                  key={sampah.sampah_id}
                >
                  <td className="p-3">{sampah.nama_sampah}</td>
                  <td className="p-3">{sampah.nama_suk}</td>
                  <td className="p-3">{formatToRupiah(sampah.harga_sampah)}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/sampah/ubah/${sampah.sampah_id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          handleDeleteClick(sampah.sampah_id);
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SampahPage;
