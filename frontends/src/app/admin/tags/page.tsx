"use client";
import { useEffect, useState } from "react";
import SideBarAdmin from "@/components/sidebar-admin";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { useAuth } from "../../(user)/login/AuthContext";

interface TagsItem {
  id: number;
  name: string;
}

interface FormDataState {
  id: number | null;
  name: string;
}

export default function AdminTags() {
  const [tags, setTags] = useState<TagsItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    id: null,
    name: "",
  });

  const { logout } = useAuth();

  const fetchTags = async () => {
    const res = await axios.get<TagsItem[]>("http://localhost:5000/api/tags");
    setTags(res.data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/tags/${id}`);
    fetchTags();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const payload = { name: formData.name };
  
    if (isEditing && formData.id !== null) {
      await axios.put(`http://localhost:5000/api/tags/${formData.id}`, payload);
    } else {
      await axios.post("http://localhost:5000/api/tags", payload);
    }
  
    setOpenModal(false);
    fetchTags();
  };
  
  const handleEdit = (item: TagsItem) => {
    setFormData({ id: item.id, name: item.name });
    setIsEditing(true);
    setOpenModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tags Management</h1>
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
            setFormData({ id: null, name: ""});
            setOpenModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 mb-6 rounded-md font-medium transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Tag Item
        </button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-700">
                <th className="px-6 py-3 text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {tags.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No gallery items found</td>
                </tr>
              ) : (
                tags.map((item, index) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 text-sm">{item.name}</td>
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
                {isEditing ? "Edit Tag Item" : "Add New Tag Item"}
              </Dialog.Title>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
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