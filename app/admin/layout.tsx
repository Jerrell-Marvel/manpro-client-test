"use client";
import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

export default function adminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    router.push("/login"); // Redirect ke halaman login
  };

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
                href="/admin/inventory"
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 hover:bg-green-500 rounded"
                href="/admin/sampah"
              >
                Manajemen Sampah
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
             <li onClick={handleLogout}>
                <button className="block py-2 hover:bg-green-500 rounded text-left">Logout</button>
              </li>
          </ul>
        </nav>
      </aside>
      <main className="p-6 w-full">{children}</main>
    </div>
    </Suspense>
  );
}