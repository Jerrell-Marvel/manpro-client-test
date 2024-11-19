"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";

type UpdateSampahProps = {
  params: {
    sampahId: string;
  };
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

function UpdateSampahPage({ params }: UpdateSampahProps) {
  const [sampah, setSampah] = useState<Sampah>();
  const [nama, setNama] = useState<string>("");
  const [harga, setHarga] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<Sampah>(`http://localhost:5000/api/sampah/${params.sampahId}`);

      setSampah(data);

      setNama(data.nama_sampah);
      setHarga(data.harga_sampah);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      namaSampah: nama,
      harga,
    };

    await axios.patch(`http://localhost:5000/api/sampah/${params.sampahId}`, body, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  };
  return (
    <div>
      <p>Sampah Id : {params.sampahId}</p>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label htmlFor="nama">Nama</label>
        <input
          type="text"
          id="nama"
          value={nama}
          onChange={(e) => {
            setNama(e.target.value);
          }}
        />

        <label htmlFor="harga">Harga</label>
        <input
          type="number"
          id="harga"
          value={harga}
          onChange={(e) => {
            setHarga(Number(e.target.value));
          }}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UpdateSampahPage;
