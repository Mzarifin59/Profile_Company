"use client";
import { useEffect, useState } from "react";
import SideBarAdmin from "@/components/sidebar-admin";
import axios from "axios";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useAuth } from "../../(user)/login/AuthContext";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface ProdukItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface FormDataState {
  id: number | null;
  title: string;
  description: string;
  image: File | null;
  imageUrl?: string;
}

export default function AdminProfilPerusahaan() {
  const [formData, setFormData] = useState<FormDataState>({
    id: null,
    title: "",
    description: "",
    image: null,
    imageUrl: "",
  });

  const fetchProfile = async () => {
    const res = await axios.get<ProdukItem[]>(
      "http://localhost:5000/api/profil-perusahaan"
    );
    const data = res.data[0];
    if (data) {
      setFormData({
        id: data.id,
        title: data.title,
        description: data.description,
        image: null,
        imageUrl: data.image,
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);

    if (formData.image) {
      form.append("image", formData.image);
    }

    if (formData.id !== null) {
      // UPDATE data
      await axios.put(
        `http://localhost:5000/api/profil-perusahaan/${formData.id}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Perubahan berhasil disimpan.");
    } else {
      alert("Data profil tidak ditemukan.");
    }
  };

  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Profil Perusahaan
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </header>

        <form
          onSubmit={handleFormSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-3xl"
        >
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
                height={300}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>

            {/* Preview gambar */}
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="mb-2 h-40 object-contain rounded"
              />
            ) : formData.imageUrl ? (
              <img
                src={`http://localhost:5000${formData.imageUrl}`} 
                alt="Current Image"
                className="mb-2 h-40 object-contain rounded"
              />
            ) : null}

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
            />
            <p className="mt-1 text-xs text-gray-500">
              Kosongkan jika tidak ingin mengganti gambar
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition duration-200"
          >
            Simpan Perubahan
          </button>
        </form>
      </main>
    </div>
  );
}
