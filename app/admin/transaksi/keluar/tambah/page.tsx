"use client";
import Line from "@/app/components/Line";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

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

function TransaksiKeluarPage() {
  const [sampah, setSampah] = useState<Sampah[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSampah, setFilteredSampah] = useState<Sampah[]>([]);
  const [isSampahModalOpen, setIsSampahModalOpen] = useState<boolean>(false);
  const [transaksi, setTransaksi] = useState<TransaksiItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataSampah } = await axios.get<Sampah[]>("http://localhost:5000/api/sampah");

      setSampah(dataSampah);
      setFilteredSampah(dataSampah);
    };

    fetchData();
  }, []);

  const filterSampah = (sampahSearchQuery: string, sampah: Sampah[]) => {
    const filtered = sampah.filter((s) => {
      if (sampahSearchQuery === "") {
        return true;
      } else {
        return s.nama_sampah.toLowerCase().includes(sampahSearchQuery.toLowerCase());
      }
    });

    setFilteredSampah(filtered);
  };

  const handleSubmit = async () => {
    const sendTransaksi = transaksi.map((t) => {
      return { sampahId: t.sampahId, jumlahSampah: t.jumlahSampah };
    });

    const { data } = await axios.post(
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
  };

  // useEffect(() => {
  //   if (sampah) {
  //     filterSampah(searchQuery, sampah);
  //   }
  // }, [searchQuery]);

  return (
    <div>
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Tambah Transaksi Keluar</h1>
      </header>

      <Line />

      <button
        className="btn"
        onClick={() => setIsSampahModalOpen(true)}
      >
        Tambah Sampah
      </button>

      {isSampahModalOpen ? (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="max-h-[80vh] w-1/2 bg-white rounded-lg overflow-y-scroll relative overflow-x-hidden pb-6">
              <div className="sticky top-0 bg-white p-6 flex justify-between items-center">
                <h2 className="text-2xl">Pilih Sampah</h2>

                <button onClick={() => setIsSampahModalOpen(false)}>X</button>
              </div>

              <Line />

              <div className="p-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    filterSampah(e.target.value, sampah);
                  }}
                  className="inp"
                  placeholder="cari sampah"
                />
              </div>

              <ul className="p-6 flex flex-col gap-4">
                {filteredSampah.map((s) => {
                  return (
                    <li
                      key={s.sampah_id}
                      className="rounded-md p-4 bg-slate-100 cursor-pointer"
                      onClick={(e) => {
                        setIsSampahModalOpen(false);
                        const newSampah = [...sampah].filter((samp) => samp.sampah_id !== s.sampah_id);
                        setSampah(newSampah);
                        filterSampah("", newSampah);
                        setSearchQuery("");

                        const newTransaksi: TransaksiItem[] = [{ jumlahSampah: 0, kuantitasInventory: s.kuantitas, sampahId: s.sampah_id, nama: s.nama_sampah }, ...transaksi];
                        setTransaksi(newTransaksi);

                        // const newTransaksi = [{ sampahId: s.sampah_id, jumlahSampah: 0, namaSampah: s.nama_sampah }, ...transaksi];
                        // setTransaksi(newTransaksi);s
                      }}
                    >
                      <div className="grid grid-cols-2">
                        <div>
                          <p>{s.nama_sampah}</p>
                          <p>{s.nama_suk}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="px-10 grid grid-cols-2">
                <p>Total Transaksi : </p>
                {/* <p>{calculateTotal(selectedTransaksiSampah)}</p> */}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <table className="w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Id Sampah</th>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {transaksi?.map((t, i) => {
            return (
              <tr
                className="border-b"
                key={t.sampahId}
              >
                <td className="p-3">{t.sampahId}</td>
                <td className="p-3">{t.nama}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={t.jumlahSampah}
                    onChange={(e) => {
                      const newTransaksi = [...transaksi];
                      newTransaksi[i].jumlahSampah = Number(e.target.value);
                      setTransaksi(newTransaksi);
                    }}
                    max={t.kuantitasInventory}
                  />
                  <span>Tersedia : {t.kuantitasInventory}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Table transaksi end */}
      <button
        onClick={() => handleSubmit()}
        className="btn"
      >
        Save
      </button>
    </div>
  );
}

export default TransaksiKeluarPage;
