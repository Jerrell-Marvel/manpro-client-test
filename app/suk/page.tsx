"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

type Suk = {
  suk_id: number;
  nama_suk: string;
  is_active: boolean;
};

export default function SukPage() {
  const [suk, setSuk] = useState<Suk[]>();
  const [namaSuk, setNamaSuk] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:5000/api/suk");

      setSuk(data);
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data } = await axios.post<{ suk_id: number }>(
      "http://localhost:5000/api/suk",
      {
        namaSUK: namaSuk,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (suk) {
      const newSuk: Suk[] = [
        {
          nama_suk: namaSuk,
          suk_id: data.suk_id,
          is_active: true,
        },
        ...suk,
      ];

      setSuk(newSuk);
    }

    setNamaSuk("");
  };

  return (
    <div>
      <form
        action=""
        onSubmit={handleFormSubmit}
      >
        <label htmlFor="nama-suk">Tambah Suk</label>
        <input
          type="text"
          id="nama-suk"
          value={namaSuk}
          onChange={(e) => {
            setNamaSuk(e.target.value);
          }}
        />

        <button type="submit">Save</button>
      </form>

      <h3>Suk Tersedia</h3>

      {suk?.map((s) => {
        return <div key={s.suk_id}>{s.nama_suk}</div>;
      })}
    </div>
  );
}
