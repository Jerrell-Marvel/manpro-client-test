"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

type Suk = {
  suk_id: number;
  nama_suk: string;
  is_active: boolean;
};

type Jenis = {
  jenis_sampah_id: number;
  nama_jenis_sampah: string;
  is_active: boolean;
};

function CreateSampah() {
  //controlled input
  const [gambarSampah, setGambarSampah] = useState<string>("");
  const [namaSampah, setNamaSampah] = useState<string>("");
  const [harga, setHarga] = useState<number>(1000);

  const [jenisSampah, setJenisSampah] = useState<Jenis[]>();
  const [suk, setSuk] = useState<Suk[]>();

  // selected (use id)
  const [selectedSuk, setSelectedSuk] = useState<number>();
  const [selectedJenis, setSelectedJenis] = useState<number>();

  //gambar sampah (file)
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: dataSuk } = await axios.get<Suk[]>("http://localhost:5000/api/suk");
      setSuk(dataSuk);
      setSelectedSuk(dataSuk[0].suk_id);

      const { data: dataJenis } = await axios.get<Jenis[]>("http://localhost:5000/api/jenis-sampah");
      setJenisSampah(dataJenis);
      setSelectedJenis(dataJenis[0].jenis_sampah_id);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      namaSampah,
      harga,
      selectedJenis,
      selectedSuk,
    });

    const formData = new FormData();

    formData.append("gambarSampah", gambarSampah);
    formData.append("namaSampah", namaSampah);
    formData.append("harga", harga.toString());
    if (selectedSuk !== undefined) {
      formData.append("sukId", selectedSuk.toString());
    }
    if (selectedJenis !== undefined) {
      formData.append("jenisSampahId", selectedJenis.toString());
    }
    if (file) {
      formData.append("gambarSampah", file);
    }

    const { data } = await axios.post("http://localhost:5000/api/sampah", formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  };

  return (
    <>
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Ubah Data Sampah</h1>
      </header>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="nama">Nama Sampah</label>
          <input
            id="nama"
            type="text"
            value={namaSampah}
            onChange={(e) => {
              setNamaSampah(e.target.value);
            }}
            className="inp"
            placeholder="Masukan nama sampah"
          />
        </div>

        <div>
          <label htmlFor="harga">Harga :</label>
          <input
            id="harga"
            type="number"
            value={harga}
            onChange={(e) => {
              setHarga(Number(e.target.value));
            }}
            className="inp"
          />
        </div>

        <div>
          <label htmlFor="gambar">Gambar Sampah</label>
          <input
            type="file"
            id="gambar"
            onChange={handleFileChange}
            className="inp"
          />
        </div>

        <div>
          <label htmlFor="jenis">Jenis Sampah : </label>
          <select
            name="jenis"
            id="jenis"
            value={selectedJenis}
            onChange={(e) => setSelectedJenis(Number(e.target.value))}
            className="inp"
          >
            {jenisSampah?.map((jenis) => {
              return (
                <option
                  value={jenis.jenis_sampah_id}
                  key={jenis.jenis_sampah_id}
                >
                  {jenis.nama_jenis_sampah}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="suk">SUK Sampah : </label>
          <select
            name="suk"
            id="suk"
            value={selectedSuk}
            onChange={(e) => setSelectedSuk(Number(e.target.value))}
            className="inp"
          >
            {suk?.map((s) => {
              return (
                <option
                  value={s.suk_id}
                  key={s.suk_id}
                >
                  {s.nama_suk}
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="submit"
          className="btn self-end"
        >
          Sambit
        </button>
      </form>
    </>
  );
}

export default CreateSampah;
