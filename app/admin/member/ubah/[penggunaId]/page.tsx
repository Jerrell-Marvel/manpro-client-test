"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type Pengguna = {
  pengguna_id: number;
  password: string;
  no_hp: string;
  alamat: string;
  email: string;
  role: string;
  kel_id: number;
  nama: string;
  nama_kel: string;
  kec_id: number;
  nama_kec: string;
};

type UpdatePenggunaProps = {
  params: {
    penggunaId: string;
  };
};

type Kecamatan = {
  kec_id: number;
  nama_kec: string;
};

type Kelurahan = {
  kel_id: number;
  nama_kel: string;
  kec_id: number;
};

function UpdatePage({ params }: UpdatePenggunaProps) {
  const router = useRouter();
  const [pengguna, setPengguna] = useState<Pengguna>({ pengguna_id: 0, password: "", no_hp: "", alamat: "", email: "", role: "", kel_id: 0, nama: "", kec_id: 0, nama_kec: "", nama_kel: "" });

  const [kecamatan, setKecamatan] = useState<Kecamatan[]>();
  const [kelurahan, setKelurahan] = useState<Kelurahan[]>();

  const [selectedKecamatan, setSelectedKecamatan] = useState<number>();
  const [selectedKelurahan, setSelectedKelurahan] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataPengguna } = await axios.get<Pengguna>(`http://localhost:5000/api/users/${params.penggunaId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setPengguna(dataPengguna);

      const { data: dataKecamatan } = await axios.get<Kecamatan[]>("http://localhost:5000/api/kecamatan");
      setKecamatan(dataKecamatan);
      setSelectedKecamatan(dataPengguna.kec_id);
    };

    fetchData();
  }, []);

  // fetch kelurahan
  useEffect(() => {
    const fetchData = async (setSelected: boolean) => {
      const { data } = await axios.get(`http://localhost:5000/api/kelurahan`, {
        params: {
          kec_id: selectedKecamatan,
        },
      });

      setKelurahan(data);
      if (setSelected) {
        setSelectedKelurahan(data[0].kel_id);
      }

      return data;
    };

    if (!selectedKelurahan) {
      setSelectedKelurahan(pengguna.kel_id);
      fetchData(false);
    } else if (selectedKecamatan) {
      fetchData(true);
    }
  }, [selectedKecamatan]);

  console.log(selectedKelurahan);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:5000/api/users/${params.penggunaId}`,
        { 
          nama: pengguna.nama, 
          noHp: pengguna.no_hp, 
          alamat: pengguna.alamat, 
          email: pengguna.email, 
          kelurahanId: selectedKelurahan 
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("User updated successfully");
      
      // Route to member page after successful update
      router.push('/admin/member');
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };



  return (
    <>
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Update Member</h1>
      </header>

      <p className="text-slate-400">Sampah Id : {params.penggunaId}</p>
      <div className="h-[1px] bg-slate-400 w-full"></div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="flex flex-col gap-4 mt-4"
      >
        <div>
          <label htmlFor="nama">Nama</label>
          <input
            type="text"
            id="nama"
            value={pengguna.nama}
            onChange={(e) => {
              setPengguna({ ...pengguna, nama: e.target.value });
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300 mt-2"
          />
        </div>

        <div>
          <label htmlFor="noHp">No Hp</label>
          <input
            type="text"
            id="noHp"
            value={pengguna.no_hp}
            onChange={(e) => {
              setPengguna({ ...pengguna, no_hp: e.target.value });
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300 mt-2"
          />
        </div>

        <div>
          <label htmlFor="alamat">Alamat</label>
          <input
            type="text"
            id="alamat"
            value={pengguna.alamat}
            onChange={(e) => {
              setPengguna({ ...pengguna, alamat: e.target.value });
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300 mt-2"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={pengguna.email}
            onChange={(e) => {
              setPengguna({ ...pengguna, email: e.target.value });
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300 mt-2"
          />
        </div>

        <div>
          <select
            name="kecamatan"
            id="kecamatan"
            onChange={(e) => {
              setSelectedKecamatan(Number(e.target.value));
            }}
            value={selectedKecamatan}
          >
            {kecamatan?.map((kec) => {
              return (
                <option
                  value={kec.kec_id}
                  key={kec.kec_id}
                >
                  {kec.nama_kec}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <select
            name="kelurahan"
            id="kelurahan"
            onChange={(e) => setSelectedKelurahan(Number(e.target.value))}
          >
            {kelurahan?.map((kel) => {
              return (
                <option
                  value={kel.kel_id}
                  key={kel.kel_id}
                  selected={kel.kel_id === selectedKelurahan}
                >
                  {kel.nama_kel}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="submit"
          className="btn self-end"
        >
          Simpan
        </button>
      </form>
    </>
  );
}

export default UpdatePage;
