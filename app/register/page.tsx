"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Kecamatan = {
  kec_id: number;
  nama_kec: string;
};

type Kelurahan = {
  kel_id: number;
  nama_kel: string;
  kec_id: number;
};

export default function Register() {
  const [kecamatan, setKecamatan] = useState<Kecamatan[]>();
  const [kelurahan, setKelurahan] = useState<Kelurahan[]>();

  const [selectedKecamatan, setSelectedKecamatan] = useState<number>();
  const [selectedKelurahan, setSelectedKelurahan] = useState<number>();

  const [nama, setNama] = useState<string>("");
  const [noHp, setNoHp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // fetch kecamatan
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<Kecamatan[]>("http://localhost:5000/api/kecamatan");

      setKecamatan(data);
      setSelectedKecamatan(data[0].kec_id);
    };

    fetchData();
  }, []);

  // fetch kelurahan
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/kelurahan`, {
        params: {
          kec_id: selectedKecamatan,
        },
      });

      setKelurahan(data);
      setSelectedKelurahan(data[0].kel_id);

      return data;
    };
    if (selectedKecamatan) {
      fetchData();
    }
  }, [selectedKecamatan]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      noHp,
      alamat,
      password,
      selectedKecamatan,
      selectedKelurahan,
    });

    const { data } = await axios.post("http://localhost:5000/api/register", {
      noHp,
      alamat,
      email,
      kelId: selectedKelurahan,
      password,
      nama,
    });
  };

  return (
    <>
      {/* <div>
        <button onClick={() => console.log(selectedKecamatan)}>click kec</button>
        <button onClick={() => console.log(selectedKelurahan)}>click kel</button>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="no-hp">No HP</label>
          <input
            id="no-hp"
            type="text"
            name="noHp"
            onChange={(e) => setNoHp(e.target.value)}
            value={noHp}
          />

          <label htmlFor="alamat">Alamat</label>
          <input
            id="alamat"
            type="text"
            name="alamat"
            onChange={(e) => setAlamat(e.target.value)}
            value={alamat}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="noHp"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <label htmlFor="kecamatan">Kecamatan</label>
          <select
            name="kecamatan"
            id="kecamatan"
            onChange={(e) => {
              setSelectedKecamatan(Number(e.target.value));
            }}
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

          <label htmlFor="kelurahan">kelurahan</label>
          <select
            name="kelurahan"
            id="kelurahan"
            value={selectedKelurahan}
            onChange={(e) => setSelectedKelurahan(Number(e.target.value))}
          >
            {kelurahan?.map((kel) => {
              return (
                <option
                  value={kel.kel_id}
                  key={kel.kel_id}
                >
                  {kel.nama_kel}
                </option>
              );
            })}
          </select>

          <input type="submit" />
        </form>
      </div> */}

      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96 fade-in">
          <h1 className="text-2xl font-bold text-center mb-4">Buat Akun</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="name"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                placeholder="Masukkan nama"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                onChange={(e) => {
                  setNama(e.target.value);
                }}
                value={nama}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="no-telp"
              >
                Nomor Telepon
              </label>
              <input
                type="text"
                id="no-telp"
                placeholder="Masukkan nomor telepon"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                onChange={(e) => setNoHp(e.target.value)}
                value={noHp}
              />
            </div>

            <div className="mb-4">
              {/*  */}
              <div>
                <label
                  htmlFor="kecamatan"
                  className="text-sm font-semibold mb-2"
                >
                  Kecamatan :{" "}
                </label>
                <select
                  name="kecamatan"
                  id="kecamatan"
                  onChange={(e) => {
                    setSelectedKecamatan(Number(e.target.value));
                  }}
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
                <label
                  htmlFor="kelurahan"
                  className="text-sm font-semibold mb-2"
                >
                  kelurahan :{" "}
                </label>
                <select
                  name="kelurahan"
                  id="kelurahan"
                  value={selectedKelurahan}
                  onChange={(e) => setSelectedKelurahan(Number(e.target.value))}
                >
                  {kelurahan?.map((kel) => {
                    return (
                      <option
                        value={kel.kel_id}
                        key={kel.kel_id}
                      >
                        {kel.nama_kel}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/*  */}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="alamat"
              >
                Alamat Lengkap
              </label>
              <input
                type="text"
                id="alamat"
                name="alamat"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                value={alamat}
                onChange={(e) => {
                  setAlamat(e.target.value);
                }}
                placeholder="Masukan alamat lengkap"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
