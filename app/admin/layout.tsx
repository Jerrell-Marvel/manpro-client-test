import Link from 'next/link';
import { Suspense } from 'react';

export default function adminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
    <div className="flex">
      {/* SIDEBAR */}
      <aside className="bg-green-600 text-white w-64 min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8">Menu Admin</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                className="block py-2 hover:bg-green-500 rounded"
                href="/admin"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 hover:bg-green-500 rounded"
                href="/admin/jenis-sampah"
              >
                Manajemen Jenis Sampah
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 hover:bg-green-500 rounded"
                href="/admin/suk"
              >
                Manajemen SUK
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 hover:bg-green-500 rounded"
                href="/admin/member"
              >
                Manajemen Member
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 hover:bg-green-500 rounded"
                href="/admin/transaksi/masuk"
              >
                Transaksi Masuk Setoran
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 hover:bg-green-500 rounded"
                href="/admin/transaksi/keluar"
              >
                Transaksi Keluar
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="p-6 w-full">{children}</main>
    </div>
    </Suspense>
  );
}