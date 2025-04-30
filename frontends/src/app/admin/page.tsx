"use client";

import SideBarAdmin from "@/components/sidebar-admin";
import { useAuth } from "../(user)/login/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBarAdmin />

      {/* Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </header>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">PT Solusi Koneksi Anda</h2>
          <p className="text-gray-700 leading-relaxed">
            PT Solusi Koneksi Anda adalah perusahaan yang bergerak di bidang
            solusi teknologi informasi, menyediakan layanan konektivitas,
            pengembangan perangkat lunak, serta infrastruktur jaringan yang
            handal untuk berbagai sektor industri.
          </p>
        </div>
      </main>
    </div>
  );
}
