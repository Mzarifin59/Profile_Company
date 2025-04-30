import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import { marked } from "marked";

interface Profil{
  title: string;
  description: string;
  image: string;
}

export default async function ProfilPerusahaan() {
  const res = await fetch(`${process.env.API_URL}/api/profil-perusahaan`, {cache: 'no-cache'});
  const data: Profil[] = await res.json();
  return (
    <>
      <NavHeader />

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-10">
          {/* Gambar Ilustrasi */}
          <div className="w-full lg:w-1/2">
            <img
              src={`http://localhost:5000${data[0].image}`}
              alt="Ilustrasi Profil Perusahaan"
              width={600}
              height={600}
              className="rounded-lg  shadow-lg"
            />
          </div>

          {/* Konten Teks */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{data[0].title}</h2>

            <div dangerouslySetInnerHTML={{__html: await marked.parse(data[0].description)}} className="markdown"/>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
