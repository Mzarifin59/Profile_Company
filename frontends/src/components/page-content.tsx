"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { marked } from "marked";

interface Item {
  title: string;
  image: string;
  description?: string;
}

interface ItemProps {
  item: Item[];
}

export default function PageContent({ item }: ItemProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [htmlContent, setHtmlContent] = useState("");

  // Fungsi convert Markdown
  useEffect(() => {
    const parseMarkdown = async () => {
      const raw = item[selectedIndex].description ?? "";
      const html = await marked.parse(raw.replaceAll("\\n", "  \n"));
      setHtmlContent(html);
    };
    parseMarkdown();
  }, [selectedIndex, item]);

  return (
    <>
      <section className="relative h-[70vh] flex items-center justify-center text-white text-center px-4">
        <Image
          src="/first-home.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-70 -z-10"
        />
        <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl leading-snug">
          {item[selectedIndex].title}
        </h1>
      </section>

      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="md:w-1/4">
            <h2 className="text-lg font-semibold mb-6">Galeri Kegiatan</h2>
            <div className="space-y-4">
              {item.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`block w-full text-left py-2 px-3 ${
                    selectedIndex === index
                      ? "text-[#FFA500] border-[#FFA500] font-semibold border-b-2"
                      : "text-gray-700 border-[#FFA500] hover:text-[#FFA500]"
                  } transition-all duration-200`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {item[selectedIndex].title}
            </h2>
            <div className="overflow-hidden">
              <img
                src={`http://localhost:5000${item[selectedIndex].image}`}
                alt={item[selectedIndex].title}
                width={500}
                height={200}
                className="h-auto w-md object-contain"
              />
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="py-4"
            />
          </div>
        </div>
      </section>
    </>
  );
}
