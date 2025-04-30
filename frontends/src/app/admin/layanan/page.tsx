"use client";
import { useEffect, useState, useRef } from "react";
import SideBarAdmin from "@/components/sidebar-admin";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { marked } from "marked";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { jsPDF } from "jspdf";
import striptags from "striptags";
import { useAuth } from "../../(user)/login/AuthContext";

// Define the autoTable module
import autoTable from "jspdf-autotable";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface ProdukItem {
  id: number;
  title: string;
  description: string;
  htmlDescription: string;
  image: string;
}

interface FormDataState {
  id: number | null;
  title: string;
  description: string;
  image: File | null;
}

export default function AdminLayanan() {
  const [products, setProducts] = useState<ProdukItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    id: null,
    title: "",
    description: "",
    image: null,
  });
  const tableRef = useRef<HTMLTableElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const { logout } = useAuth();

  const fetchProducts = async () => {
    const res = await axios.get<ProdukItem[]>("http://localhost:5000/api/produk");
  
    const productsWithHtml = await Promise.all(
      res.data.map(async (item) => ({
        ...item,
        htmlDescription: await marked.parse(item.description.replaceAll("\\n", "  \n")),
      }))
    );
  
    setProducts(productsWithHtml);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/produk/${id}`);
    fetchProducts();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);

    // Only send image if user uploads a new file
    if (formData.image) {
      form.append("image", formData.image);
    }

    if (isEditing && formData.id !== null) {
      await axios.put(`http://localhost:5000/api/produk/${formData.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axios.post("http://localhost:5000/api/produk", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    setOpenModal(false);
    fetchProducts();
  };

  const handleEdit = (item: ProdukItem) => {
    setFormData({
      id: item.id,
      title: item.title,
      description: item.description,
      image: null,
    });
    setIsEditing(true);
    setOpenModal(true);
  };

  const generatePDF = async () => {
    setIsPrinting(true);

    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF("p", "mm", "a4");

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(128, 0, 128); // Purple color
      pdf.text("Daftar Layanan", 14, 20);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Tanggal cetak: ${new Date().toLocaleDateString()}`, 14, 28);

      // First, load all images using promises
      const imagePromises = products.map((item) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous"; // This helps with CORS issues
          img.onload = () => resolve(img);
          img.onerror = (err) => {
            console.error(`Failed to load image: ${err}`);
            resolve(null); // Resolve with null instead of rejecting to continue with other images
          };
          img.src = `http://localhost:5000${item.image}`;
        });
      });

      // Wait for all images to load
      const loadedImages = await Promise.all(imagePromises);

      // Set the y-position tracker for content after the table
      let yPos = 35;

      // Add table
      const tableData = await Promise.all(
        products.map(async (item, index) => {
          const parsedMarkdown = await marked.parse(item.description || "");
          const plainText = striptags(parsedMarkdown); // Buang HTML tag
      
          return [
            index + 1,
            item.title,
            plainText,
          ];
        })
      );

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      // Use autoTable as a function instead of a method
      autoTable(pdf, {
        head: [["No", "Nama Produk", "Deskripsi"]],
        body: tableData,
        startY: yPos,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineColor: [200, 200, 200],
        },
        headStyles: {
          fillColor: [128, 0, 128],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
          2: { cellWidth: 120 },
        },
        didDrawPage: (data) => {
          // Update y-position for content after the table
          if (data.cursor) {
            yPos = data.cursor.y + 15;
          }
        },
      });

      // Add product images after the table
      pdf.setFontSize(14);
      pdf.setTextColor(128, 0, 128);
      pdf.text("Gambar Produk", 14, yPos);
      yPos += 10;

      // Calculate image dimensions and positions
      const imageWidth = 40; // mm
      const imageHeight = 30; // mm
      const imagesPerRow = 4;
      const marginX = 14; // Left margin
      const marginY = 5; // Space between rows

      // Add images to PDF
      for (let i = 0; i < loadedImages.length; i++) {
        const img = loadedImages[i];
        if (!img) continue; // Skip if image failed to load

        const row = Math.floor(i / imagesPerRow);
        const col = i % imagesPerRow;

        const x = marginX + col * (imageWidth + 5); // 5mm spacing between images
        const y = yPos + row * (imageHeight + marginY);

        // Check if we need a new page
        if (y + imageHeight > pdf.internal.pageSize.height - 20) {
          pdf.addPage();
          yPos = 20; // Reset Y position on new page
          pdf.setFontSize(14);
          pdf.setTextColor(128, 0, 128);
          pdf.text("Gambar Produk (lanjutan)", 14, yPos);
          yPos += 10;

          // Recalculate position for this image on new page
          const newRow = 0;
          const newY = yPos + newRow * (imageHeight + marginY);

          if (img instanceof HTMLImageElement) {
            try {
              pdf.addImage(img, "JPEG", x, newY, imageWidth, imageHeight);
            } catch (err) {
              console.error("Failed to add image to PDF:", err);
            }
          }
        } else {
          // Add image on current page
          if (img instanceof HTMLImageElement) {
            try {
              pdf.addImage(img, "JPEG", x, y, imageWidth, imageHeight);
            } catch (err) {
              console.error("Failed to add image to PDF:", err);
            }
          }
        }
      }

      // Add footer with page numbers
      const pageCount = pdf.internal.pages.length;
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Halaman ${i} dari ${pageCount}`,
          pdf.internal.pageSize.width / 2,
          pdf.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      pdf.save("daftar-produk.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Service Management
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </header>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                id: null,
                title: "",
                description: "",
                image: null,
              });
              setOpenModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-medium transition duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Product Item
          </button>

          <button
            onClick={generatePDF}
            disabled={isPrinting || products.length === 0}
            className={`bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium transition duration-200 flex items-center ${
              isPrinting || products.length === 0
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isPrinting ? "Membuat PDF..." : "Export PDF"}
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table ref={tableRef} className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-700">
                <th className="px-6 py-3 text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No gallery items found
                  </td>
                </tr>
              ) : (
                products.map((item, index) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4">
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.title}
                        className="h-16 w-24 object-cover rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">{item.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <div
                       dangerouslySetInnerHTML={{ __html: item.htmlDescription }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              <Dialog.Title className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
                {isEditing ? "Edit Produk Item" : "Add New Produk Item"}
              </Dialog.Title>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="bg-white border border-gray-300 rounded-md p-2">
                    <MDEditor
                      value={formData.description}
                      onChange={(value) =>
                        setFormData({ ...formData, description: value || "" })
                      }
                      preview="edit"
                      height={200}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files ? e.target.files[0] : null,
                      })
                    }
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    accept="image/*"
                    required={!isEditing}
                  />
                  {isEditing && (
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to keep current image
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition duration-200"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </main>
    </div>
  );
}
