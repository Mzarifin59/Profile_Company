"use client";
import { useEffect, useState } from "react";
import SideBarAdmin from "@/components/sidebar-admin";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { marked } from "marked";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useAuth } from "../../(user)/login/AuthContext";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});       

interface Tag {
  id: number;
  name: string;
}

interface ArtikelItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  image: string;
  content: string;
  tags?: Tag[];
}

interface FormDataState {
  id: number | null;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  image: File | null;
  selectedTags: number[];
}

export default function AdminArtikel() {
  const [articles, setArticles] = useState<ArtikelItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    id: null,
    title: "",
    slug: "",
    description: "",
    content: "",
    date: new Date().toISOString().substring(0, 10),
    image: null,
    selectedTags: [],
  });

  const { logout } = useAuth();

  const fetchArticles = async () => {
    const res = await axios.get<ArtikelItem[]>("http://localhost:5000/api/artikel-tags");
    setArticles(res.data);
  };

  const fetchTags = async () => {
    const res = await axios.get<Tag[]>("http://localhost:5000/api/tags");
    setTags(res.data);
  };

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, []);

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/artikel/${id}`);
    fetchArticles();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("slug", formData.slug);
    form.append("description", formData.description);
    form.append("content", formData.content);
    form.append("date", formData.date);
    if (formData.image) {
      form.append("image", formData.image);
    }

    let artikelId = formData.id;

    if (isEditing && formData.id !== null) {
        await axios.put(`http://localhost:5000/api/artikel/${formData.id}`, form);
      
        // 🔥 Hapus semua relasi tag lama
        await axios.delete(`http://localhost:5000/api/artikel-pivot/${formData.id}`);
      } else {
        const response = await axios.post("http://localhost:5000/api/artikel", form);
        artikelId = response.data.id;
      }
      
      // ⛏️ Tambah relasi tag baru
      await Promise.all(
        formData.selectedTags.map(tagId =>
          axios.post("http://localhost:5000/api/artikel-pivot", {
            artikel_id: artikelId,
            tag_id: tagId
          })
        )
      );

    setOpenModal(false);
    fetchArticles();
  };

  const handleEdit = (item: ArtikelItem) => {
    setFormData({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content,
      date: item.date.substring(0, 10),
      image: null,
      selectedTags: item.tags?.map(tag => tag.id) || [],
    });
    setIsEditing(true);
    setOpenModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Articles Management</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </header>

        <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                id: null,
                title: "",
                slug: "",
                description: "",
                content: "",
                date: new Date().toISOString().substring(0, 10),
                image: null,
                selectedTags: [],
              });
              setOpenModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 mb-6 rounded-md font-medium"
          >
            + Add New Article
          </button>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-700">
                <th className="px-6 py-3 text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-sm font-semibold">Tags</th>
                <th className="px-6 py-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{item.title}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.tags?.map(tag => (
                      <span key={tag.id} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-1">
                        {tag.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
              <Dialog.Title className="text-xl font-bold mb-4">
                {isEditing ? "Edit Article" : "Add New Article"}
              </Dialog.Title>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <label htmlFor="">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Title"
                  required
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <label htmlFor="">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Slug"
                  required
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <label htmlFor="">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <label htmlFor="">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  required
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <label htmlFor="">Content</label>
                <MDEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value || "" })}
                  preview="edit"
                  height={250}
                />
                <label htmlFor="">Image</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full text-sm"
                  accept="image/*"
                  required={!isEditing}
                />

                <div>
                  <label className="block font-medium mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <label key={tag.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.selectedTags.includes(tag.id)}
                          onChange={() => {
                            const selected = formData.selectedTags.includes(tag.id)
                              ? formData.selectedTags.filter(id => id !== tag.id)
                              : [...formData.selectedTags, tag.id];
                            setFormData({ ...formData, selectedTags: selected });
                          }}
                        />
                        {tag.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="bg-gray-200 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded"
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
