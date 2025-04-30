import Link from "next/link";
import { MapPinHouse, CircleHelp } from "lucide-react";

export default function Footer() {
  return (
    <>
      <div className="p-6 sm:p-10 bg-gray-50">
        <div className="flex flex-col lg:flex-row justify-between gap-10 max-w-7xl mx-auto">
          {/* Kolom Logo + Social */}
          <div className="flex flex-col flex-[2]">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo" width={60} />
              <p className="text-lg font-semibold">PT Solusi Koneksi Anda</p>
            </div>
            <div className="flex gap-3 flex-wrap pl-1">
              {[
                {
                  href: "/",
                  svgClass: "h-5 w-5",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  href: "/",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  href: "/",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  ),
                },
                {
                  href: "/",
                  icon: (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="w-10 h-10 rounded-full bg-[#FFA500] hover:bg-orange-500 flex items-center justify-center transition-colors"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Kolom Info */}
          <div className="flex flex-col sm:flex-row gap-8 flex-[3]">
            {/* Alamat */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex gap-2 items-center">
                <MapPinHouse size={24} color="#FFA500"/>
                <p className="font-medium text-base">Alamat</p>
              </div>
              <p className="text-sm leading-relaxed">
                Pesona Kahuripan 2 Og Tulip IX Block B13 No.25 RT/RW: 002/026
                Ke/Desa: Cikahuripan, Kecamatan: Klapanunggal
              </p>
              <Link href="/kontak">
                <button className="px-4 py-2 w-max bg-[#FFA500] text-white hover:bg-orange-500 rounded text-sm">
                  Klik Di Sini
                </button>
              </Link>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex gap-2 items-center">
                <CircleHelp size={24} color="#FFA500"/>
                <p className="font-medium text-base">Support</p>
              </div>
              <p className="text-sm">6281295312290</p>
              <p className="text-sm">info@solusikoneksianda.com</p>
            </div>
          </div>
        </div>
      </div>
      <h4 className="text-center py-5">Copyright © 2024 All right reserved</h4>
    </>
  );
}
