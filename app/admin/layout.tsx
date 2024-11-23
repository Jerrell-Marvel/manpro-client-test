export default function adminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      {/* SIDEBAR */}
      <aside className="bg-green-600 text-white w-64 min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8">Menu Admin</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <a
                className="block py-2 hover:bg-green-500 rounded"
                href="dashboard.html"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                className="block py-2 hover:bg-green-500 rounded"
                href="manajemen-jenis-sampah.html"
              >
                Manajemen Jenis Sampah
              </a>
            </li>
            <li>
              <a
                className="block py-2 hover:bg-green-500 rounded"
                href="manajemen-member.html"
              >
                Manajemen Member
              </a>
            </li>
            <li>
              <a
                className="block py-2 hover:bg-green-500 rounded"
                href="transaksi-setoran-sampah.html"
              >
                Transaksi Setoran
              </a>
            </li>
            <li>
              <a
                className="block py-2 hover:bg-green-500 rounded"
                href="pelaporan.html"
              >
                Pelaporan
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="p-6 w-full">{children}</main>
    </div>
  );
}
