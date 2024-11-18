"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

type JenisSampah = {
  jenis_sampah_id: number;
  nama_jenis_sampah: string;
  is_active: boolean;
};

export default function JenisSampahPage() {
  const [jenisSampah, setJenisSampah] = useState<JenisSampah[]>();
  const [namaJenis, setNamaJenis] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:5000/api/jenis-sampah");

      setJenisSampah(data);
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data } = await axios.post<{ suk_id: number }>(
      "http://localhost:5000/api/jenis-sampah",
      {
        namaJenisSampah: namaJenis,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (jenisSampah) {
      const newSuk: JenisSampah[] = [
        {
          nama_jenis_sampah: namaJenis,
          jenis_sampah_id: data.suk_id,
          is_active: true,
        },
        ...jenisSampah,
      ];

      setJenisSampah(newSuk);
    }

    setNamaJenis("");
  };

  return (
    <div>
      <form
        action=""
        onSubmit={handleFormSubmit}
      >
        <label htmlFor="nama-suk">Tambah Jenis</label>
        <input
          type="text"
          id="nama-suk"
          value={namaJenis}
          onChange={(e) => {
            setNamaJenis(e.target.value);
          }}
        />

        <button type="submit">Save</button>
      </form>

      <h3>Jenis Tersedia</h3>

      {jenisSampah?.map((js) => {
        return <div key={js.jenis_sampah_id}>{js.nama_jenis_sampah}</div>;
      })}
    </div>
  );
}
