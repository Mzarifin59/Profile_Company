"use client";
import { useEffect, useState } from "react";
import SideBarAdmin from "@/components/sidebar-admin";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { useAuth } from "../../(user)/login/AuthContext";

interface GaleryItem {
  id: number;
  title: string;
  image: string;
}

interface FormDataState {
  id: number | null;
  title: string;
  image: File | null;
}

export default function AdminGalery() {
  const [galeries, setGaleries] = useState<GaleryItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    id: null,
    title: "",
    image: null,
  });

  const fetchGaleries = async () => {
    const res = await axios.get<GaleryItem[]>("http://localhost:5000/api/galery");
    setGaleries(res.data);
  };

  useEffect(() => {
    fetchGaleries();
  }, []);

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/galery/${id}`);
    fetchGaleries();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
  
    // Only send image if user uploads a new file
    if (formData.image) {
      form.append("image", formData.image);
    }
  
    if (isEditing && formData.id !== null) {
      await axios.put(`http://localhost:5000/api/galery/${formData.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } else {
      await axios.post("http://localhost:5000/api/galery", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }
  
    setOpenModal(false);
    fetchGaleries();
  };
  
  const handleEdit = (item: GaleryItem) => {
    setFormData({ id: item.id, title: item.title, image: null });
    setIsEditing(true);
    setOpenModal(true);
  };

  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
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
            setFormData({ id: null, title: "", image: null });
            setOpenModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 mb-6 rounded-md font-medium transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Gallery Item
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-700">
                <th className="px-6 py-3 text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {galeries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No gallery items found</td>
                </tr>
              ) : (
                galeries.map((item, index) => (
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
        <Dialog open={openModal} onClose={() => setOpenModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              <Dialog.Title className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
                {isEditing ? "Edit Gallery Item" : "Add New Gallery Item"}
              </Dialog.Title>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
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
                    <p className="mt-1 text-xs text-gray-500">Leave empty to keep current image</p>
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