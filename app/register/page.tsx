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
    console.log({
      email,
      noHp,
      alamat,
      password,
      selectedKecamatan,
      selectedKelurahan,
    });
    e.preventDefault();
  };

  return (
    <div>
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
    </div>
  );
}
