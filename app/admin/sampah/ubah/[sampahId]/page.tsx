"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/getToken";
import { redirect, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  const [nama, setNama] = useState<string>("");
  const [harga, setHarga] = useState<number>();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<Sampah>(`http://localhost:5000/api/sampah/${params.sampahId}`);
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

    router.push("/admin/sampah");
  };
  return (
    <>
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Ubah Data Sampah</h1>
      </header>

      <p className="text-slate-400">Sampah Id : {params.sampahId}</p>
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
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300 mt-2"
          />
        </div>

        <div>
          <label htmlFor="harga">Harga</label>
          <input
            type="number"
            id="harga"
            value={harga}
            onChange={(e) => {
              setHarga(Number(e.target.value));
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300 mt-2"
          />
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
export default UpdateSampahPage;
