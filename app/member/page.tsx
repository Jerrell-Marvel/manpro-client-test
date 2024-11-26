export default function ClientDashboard() {
    return (
      <>
        {/* Header */}
        <header className="bg-green-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Client Dashboard</h1>
            <nav className="space-x-4">
              <a href="/" className="hover:text-green-300">Beranda</a>
              <a href="#purchase-prices" className="hover:text-green-300">Harga Pembelian</a>
              <a href="#deposit-history" className="hover:text-green-300">Riwayat Deposit</a>
              <a href="#income-report" className="hover:text-green-300">Laporan Pendapatan</a>
              <a href="/" className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Logout</a>
            </nav>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-10">
          <section id="purchase-prices" className="mb-20">
            <h2 className="text-2xl font-bold mb-4">Lihat Harga Pembelian Limbah</h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 border-b">Jenis Limbah</th>
                  <th className="py-2 border-b">Harga Pembelian (per kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 border-b text-center">Plastik</td>
                  <td className="py-2 border-b text-center">Rp. 100</td>
                </tr>
                <tr>
                  <td className="py-2 border-b text-center">Kaca</td>
                  <td className="py-2 border-b text-center">Rp. 100</td>
                </tr>
                <tr>
                  <td className="py-2 border-b text-center">Gelas</td>
                  <td className="py-2 border-b text-center">Rp. 100</td>
                </tr>
              </tbody>
            </table>
          </section>
  
          <section id="deposit-history" className="mb-20">
            <h2 className="text-2xl font-bold mb-4">Lihat Riwayat Deposit Limbah</h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 border-b">Tanggal</th>
                  <th className="py-2 border-b">Jenis Sampah</th>
                  <th className="py-2 border-b">Kuantitas(kg)</th>
                  <th className="py-2 border-b">Jumlah Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 border-b text-center">01/01/2023</td>
                  <td className="py-2 border-b text-center">Plastik</td>
                  <td className="py-2 border-b text-center">10</td>
                  <td className="py-2 border-b text-center">Rp. 1000</td>
                </tr>
                <tr>
                  <td className="py-2 border-b text-center">01/15/2023</td>
                  <td className="py-2 border-b text-center">Gelas</td>
                  <td className="py-2 border-b text-center">5</td>
                  <td className="py-2 border-b text-center">Rp. 500</td>
                </tr>
              </tbody>
            </table>
          </section>
  
          <section id="income-report">
            <h2 className="text-2xl font-bold mb-4">Laporan Masukan</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">Total pendapatan dari deposit limbah: <strong>Rp. 1500</strong></p>
              <p className="mb-4">Pendapatan dari deposit pada Januari 2023:</p>
              <ul className="list-disc list-inside">
                <li>Plastic: Rp. 1000</li>
                <li>Glass: Rp. 500</li>
              </ul>
            </div>
          </section>
        </main>
  
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            &copy; 2024 Sistem Informasi Bank Sampah. All rights reserved.
          </div>
        </footer>
      </>
    )
  }