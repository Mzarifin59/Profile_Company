import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";

interface Artikel {
  title: string;
  image: string;
  description: string;
  content: string;
  slug: string;
  tags: { id: number; name: string }[];
  date: string;
}

interface ArtikelPageProps {
  params: Promise<{ slug: string }>;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default async function DetailArticle({ params }: ArtikelPageProps) {
  const { slug } = await params;
  const res = await fetch(`${process.env.API_URL}/api/artikel-tags/${slug}`);
  const artikel: Artikel = await res.json();

  return (
    <>
      <NavHeader />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-white text-center px-4">
        <Image
          src="/first-home.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-70 -z-10"
        />
        <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl leading-snug drop-shadow">
          Artikel
        </h1>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* Featured Image */}
        <div className="relative w-full h-64 md:h-[400px] mb-8 rounded-lg overflow-hidden bg-white flex items-center justify-center">
          <img
            src={`http://localhost:5000${artikel.image}`}
            alt={artikel.title}
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute bottom-4 left-4 bg-[#FFA500] text-white w-12 h-12 rounded-md flex flex-col items-center justify-center shadow-md">
            <p className="text-sm font-bold leading-none">
              {formatDate(artikel.date).slice(0, 2)}
            </p>
            <p className="text-xs">{formatDate(artikel.date).slice(3, 6)}</p>
          </div>
        </div>

        {/* Title & Tags */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          {artikel.title}
        </h2>
        <div className="flex flex-wrap gap-2 text-sm mb-4">
          {artikel.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          {artikel.description}
        </p>

        {/* Markdown Content */}
        <article
          className=" max-w-none markdown"
          dangerouslySetInnerHTML={{ __html: await marked.parse(artikel.content) }}
        />

        {/* Back Button */}
        <div className="mt-10">
          <Link href="/artikel">
            <button className="bg-[#FFA500] hover:bg-orange-500 text-white font-medium px-6 py-2 rounded transition">
              Kembali
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
