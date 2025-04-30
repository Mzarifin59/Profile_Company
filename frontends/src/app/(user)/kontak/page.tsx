import Image from "next/image";
import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";

export default function KontakPage() {
  return (
    <>
      <NavHeader />

      <section className="relative h-[80vh] flex items-center justify-center text-white text-center px-4">
        <Image
          src="/first-home.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-70 -z-10"
        />
          <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl leading-snug">
            Kontak Kami
          </h1>
      </section>

      <Footer />
    </>
  );
}
