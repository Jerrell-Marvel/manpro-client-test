import Image from "next/image";

type Sampah = {
  sampah_id: number;
  nama_sampah: string;
  url_gambar: string;
  harga_sampah: string;
  nama_suk: string;
};

export default async function Home() {
  const data = await fetch("http://localhost:5000/api/sampah");
  const sampahList = (await data.json()) as Sampah[];

  return (
    <div>
      <h1 className="text-4xl">HOME PAGE</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate minima sint in, facilis rem beatae suscipit necessitatibus enim quia, quam quasi. Praesentium iusto tenetur voluptatem pariatur, blanditiis et error nesciunt! Hic
        exercitationem tempore laborum suscipit? Ut incidunt perferendis eligendi rerum fuga exercitationem placeat ratione quam ab minima laboriosam, soluta vero.
      </p>
      {sampahList.map((sampah) => {
        return (
          <div key={sampah.sampah_id}>
            <Image
              src={`http://localhost:5000/${sampah.url_gambar}`}
              alt={sampah.url_gambar}
              width={150}
              height={150}
            ></Image>
            <p key={sampah.sampah_id}>{sampah.nama_sampah}</p>
            <p key={sampah.sampah_id}>{sampah.harga_sampah}</p>
          </div>
        );
      })}
    </div>
  );
}
