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
    <>
      <header className="bg-green-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sistem Informasi Bank Sampah</h1>
          <nav className="space-x-4">
            <a
              href="#services"
              className="hover:text-green-300"
            >
              Layanan
            </a>
            <a
              href="#about"
              className="hover:text-green-300"
            >
              Tentang Kami
            </a>
            <a
              href="#contact"
              className="hover:text-green-300"
            >
              Kontak
            </a>
            <a
              href="admin-login.html"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Login sebagai Admin
            </a>
            <a
              href="member-login.html"
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
            >
              Login sebagai Member
            </a>
          </nav>
        </div>
      </header>

      <section className="hero-bg text-black py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Bergabunglah dengan Kami dalam Membuat Perbedaan</h2>
          <p className="mb-8 text-lg"> Bersama-sama, kita dapat menciptakan planet yang lebih bersih dan lebih hijau.</p>
          <a
            href="#services"
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold"
          >
            {" "}
            Jelajahi Layanan Kami
          </a>
        </div>
      </section>

      <section
        id="services"
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Layanan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-3">Setor Sampah</h3>
              <p>Layanan setor sampah yang dapat diandalkan untuk rumah dan bisnis</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-3">Program Bank Sampah</h3>
              <p>Melestarikan lingkungan dan membangkitkan ekonomi</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-3">Kesadaran Masyarakat</h3>
              <p>Kami melibatkan masyarakat dalam menjaga lingkungan</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="bg-gray-200 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Tentang kami</h2>
          <p className="mb-6"> Kami berdedikasi untuk mempromosikan praktik pengelolaan limbah yang berkelanjutan yang bermanfaat bagi masyarakat dan lingkungan.</p>
          <a
            href="#contact"
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold"
          >
            Daftar
          </a>
        </div>
      </section>

      <section
        id="contact"
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Kontak Kami</h2>
          <p className="mb-6">Silahkan Bertanya</p>
          <form className="max-w-lg mx-auto">
            <input
              type="text"
              className="border border-gray-300 p-3 w-full mb-4"
              placeholder="Nama"
              required
            />
            <input
              type="email"
              className="border border-gray-300 p-3 w-full mb-4"
              placeholder="Email"
              required
            />
            <textarea
              className="border border-gray-300 p-3 w-full mb-4"
              rows={4}
              placeholder="Pesan"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg"
            >
              Kirim pesan
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">&copy; 2024 Sistem Informasi Bank Sampah. All rights reserved.</div>
      </footer>
    </>
  );
}
