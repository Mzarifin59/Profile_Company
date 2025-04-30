"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, MessageSquareText, Menu, X } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  text: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { text: "Home", href: "/" },
  { text: "Profil Perusahaan", href: "/profil-perusahaan" },
  { text: "Layanan", href: "/layanan" },
  { text: "Artikel", href: "/artikel" },
  { text: "Galeri Kegiatan", href: "/galery" },
  { text: "Kontak Kami", href: "/kontak" },
];

export default function NavHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="px-5 sm:px-10 border-b border-[#FFA500]">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0 py-2">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" width={60} />
            <h3 className="text-lg font-semibold">PT Solusi Konek Indonesia</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4"  color="#FFA500" />
              <p>info@solusikoneksianda.com</p>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-4 h-4"  color="#FFA500" />
              <p>6281295312290</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu toggle */}
      <div className="md:hidden px-5 flex justify-end items-center py-4">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Main Navbar */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } md:flex px-5 sm:px-14 py-4 flex-col md:flex-row gap-4 md:gap-10 bg-white md:bg-transparent`}
      >
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={index} href={item.href} onClick={() => setMenuOpen(false)}>
              <p
                className={`text-base md:text-xl whitespace-nowrap ${
                  isActive ? "text-[#FFA500]" : "hover:text-[#FFA500]"
                }`}
              >
                {item.text}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
