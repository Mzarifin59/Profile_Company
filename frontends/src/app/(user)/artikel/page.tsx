import Image from "next/image";
import Link from "next/link";
import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";

interface ListArtikel {
  title: string;
  image: string;
  description: string;
  slug: string;
  tags: {
    id: number;
    name: string;
  }[];
  date: string; 
  content: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default async function Artikel() {
  const res = await fetch(`${process.env.API_URL}/api/artikel-tags`, {cache: 'no-cache'});
  const listArtikel: ListArtikel[] = await res.json();
  return (
    <>
      <NavHeader />

      <section className="relative h-[50vh] flex items-center justify-center text-white text-center px-4">
        <Image
          src="/first-home.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-70 -z-10"
        />
        <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl leading-snug">
          Artikel
        </h1>
      </section>

      <section className="py-16 px-4 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Artikel Terbaru</h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {listArtikel.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <Link href={`/artikel/${item.slug}`}>
                <div className="relative">
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="w-full h-56 object-cover"
                  />
                  {/* Tanggal dalam posisi absolute */}
                  <div className="absolute bottom-0 left-12 bg-[#FFA500] text-white text-center justify-center flex items-center flex-col w-12 h-12 rounded">
                    <p className="text-sm font-bold leading-none">
                    {formatDate(item.date).slice(0,2)}
                    </p>
                    <p className="text-xs">{formatDate(item.date).slice(3, 6)}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {item.title} 
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {item.description} 
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {item.tags.map((tag, i) => (
                      <span key={tag.id} className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
