import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center text-white text-center px-4">
        <Image
          src="/first-home.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-70 -z-10"
        />
        <div>
          <p className="text-xl sm:text-2xl font-bold max-w-2xl leading-snug">
            PT Solusi Koneksi Anda
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl leading-snug">
            Mitra Teknologi Dan <br /> Konektivitas Anda
          </h1>
        </div>
      </section>

      {/* Kenapa Memilih Kami */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-center">
          <div className="w-full lg:w-1/2">
            <Image
              src="/second-home.jpg"
              alt="Kenapa Memilih Kami"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4">
              Kenapa Harus Memilih Kami?
            </h2>
            <ul className="space-y-2 text-gray-700">
              {[
                "Profesional dan Berpihak Teknologi",
                "Responsif dan Solutif",
                "Harga Kompetitif dan Jelas",
                "Dukungan Teknologi yang Berpengalaman",
                "Pelayanan dan Komunikatif Responsif",
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="text-[#FFA500] w-5 h-5 mt-1" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/kontak"
              className="mt-6 inline-block px-6 py-3 bg-[#FFA500] hover:bg-orange-500 text-white font-semibold rounded-md transition"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      <section className="relative h-[300px] sm:h-[350px] py-16 px-6 bg-gray-900 text-white overflow-hidden">
        <Image
          src="/third-home.jpg"
          alt="Keamanan Banner"
          fill
          className="object-cover opacity-30 z-0" // ubah -z-10 jadi z-0
        />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 h-full">
          <div>
            <h3 className="text-5xl font-semibold mb-2">
              Ayo Cek Layanan Kita!
            </h3>
            <p>Jelajahi layanan kami yang pasti 100% aman dan terpercaya.</p>
          </div>
          <Link
            href="/layanan"
            className="bg-[#FFA500] hover:bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
          >
            Lihat Layanan
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
