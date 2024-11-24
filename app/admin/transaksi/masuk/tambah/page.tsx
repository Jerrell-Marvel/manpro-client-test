"use client";

import Line from "@/app/components/Line";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

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

type Inventory = {
  inventory_sampah_id: number;
  sampah_id: number;
  kuantitas: number;
};

function TambahTransaksiPage() {
  const [penggunaList, setPenggunaList] = useState<Pengguna[]>([]);
  const [filteredPengguna, setFilteredPengguna] = useState<Pengguna[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<number>();
  const [isSampahModalOpen, setIsSampahModalOpen] = useState<boolean>(false);

  const [sampah, setSampah] = useState<Sampah[]>([]);
  const [filteredSampah, setFilteredSampah] = useState<Sampah[]>([]);
  const [sampahSearchQuery, setSampahSearchQuery] = useState<string>("");

  const [transaksi, setTransaksi] = useState<{ sampahId: number; jumlahSampah: number; namaSampah: string }[]>([]);

  const [inventory, setInventory] = useState<Inventory[]>([]);

  // fetch from api
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

        // Inventory
        const { data: dataInventory } = await axios.get<Inventory[]>("http://localhost:5000/api/inventory", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setInventory(dataInventory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterPengguna = (userSearchQuery: string) => {
    const filtered = penggunaList.filter((item) => {
      if (userSearchQuery === "") {
        return true;
      } else {
        return item.nama.toLowerCase().includes(userSearchQuery.toLowerCase());
      }
    });

    console.log(filtered);
    setFilteredPengguna(filtered);
  };

  const filterSampah = (sampahSearchQuery: string, sampah: Sampah[]) => {
    const filtered = sampah.filter((s) => {
      if (sampahSearchQuery === "") {
        return true;
      } else {
        return s.nama_sampah.toLowerCase().includes(sampahSearchQuery.toLowerCase());
      }
    });

    console.log(sampahSearchQuery, filtered);

    setFilteredSampah(filtered);
  };

  useEffect(() => {
    if (sampahSearchQuery !== undefined) {
      filterSampah(sampahSearchQuery, sampah);
    }
  }, [sampahSearchQuery]);

  const findJumlahSampahInInventory = (sampahId: number) => {
    return inventory.find((i) => i.sampah_id == sampahId)?.kuantitas;
  };

  const handleSubmit = async () => {
    const sendTransaksi = transaksi.map((t) => {
      return { sampahId: t.sampahId, jumlahSampah: t.jumlahSampah };
    });

    console.log({
      penggunaId: selectedUser,
      transaksiSampah: sendTransaksi,
    });

    const { data } = await axios.post(
      "http://localhost:5000/api/transaksi/masuk",
      {
        penggunaId: selectedUser,
        transaksiSampah: sendTransaksi,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Tambah Transaksi</h1>
      </header>

      <button
        className="btn"
        onClick={(e) => setIsSampahModalOpen(true)}
      >
        Tambah Sampah
      </button>

      {/* MODAL TAMBAH SAMPAH START */}
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
                  value={sampahSearchQuery}
                  onChange={(e) => setSampahSearchQuery(e.target.value)}
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
                        if (sampahSearchQuery === "") {
                          filterSampah("", newSampah);
                        } else {
                          setSampahSearchQuery("");
                        }

                        const newTransaksi = [{ sampahId: s.sampah_id, jumlahSampah: 0, namaSampah: s.nama_sampah }, ...transaksi];
                        setTransaksi(newTransaksi);
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
      {/* MODAL TAMBAH SAMPAH END*/}

      <Line />

      <div>
        <label htmlFor="">Pilih Pengguna</label>
        <input
          type="text"
          placeholder="Search..."
          value={userSearchQuery}
          onChange={(e) => {
            setUserSearchQuery(e.target.value);
            filterPengguna(e.target.value);
          }}
          className="inp"
          onFocus={(e) => filterPengguna(e.target.value)}
        />

        {filteredPengguna.length !== 0 ? (
          <>
            <div className="relative">
              <ul className="absolute top-0 pt-2 w-full flex flex-col gap-[3px] bg-slate-100">
                {filteredPengguna.map((item) => (
                  <li
                    key={item.pengguna_id}
                    onClick={(e) => {
                      setUserSearchQuery(item.nama);
                      setFilteredPengguna([]);
                      setSelectedUser(item.pengguna_id);
                    }}
                    className="cursor-pointer bg-white rounded-md p-4"
                  >
                    {item.nama}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>

      {/* Table transaksi start */}
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
                <td className="p-3">{t.namaSampah}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={t.jumlahSampah}
                    onChange={(e) => {
                      const newTransaksi = [...transaksi];
                      newTransaksi[i].jumlahSampah = Number(e.target.value);
                      setTransaksi(newTransaksi);
                    }}
                    max={findJumlahSampahInInventory(t.sampahId)}
                  />
                  <span>Tersedia : {findJumlahSampahInInventory(t.sampahId)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Table transaksi end */}

      <button
        className="btn"
        onClick={() => handleSubmit()}
      >
        Save
      </button>
    </div>
  );
}

export default TambahTransaksiPage;
