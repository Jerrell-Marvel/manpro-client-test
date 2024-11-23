import { formatToRupiah } from "@/utils/formatter";
import React from "react";

type Sampah = {
  sampah_id: number;
  nama_sampah: string;
  url_gambar: string;
  harga_sampah: number;
  nama_suk: string;
};

const SampahPage = async () => {
  const data = await fetch("http://localhost:5000/api/sampah");
  const sampahList = (await data.json()) as Sampah[];
  return (
    <>
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manajemen Jenis Sampah</h1>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Tambahkan Jenis Sampah Baru</button>
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
              {sampahList.map((sampah) => {
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
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Hapus</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default SampahPage;
