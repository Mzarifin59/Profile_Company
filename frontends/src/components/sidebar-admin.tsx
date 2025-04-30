export default function SideBarAdmin() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="flex items-center border-b border-gray-800">
        <img src="/logo.png" alt="" width={70} />
        <div className="text-xl font-bold py-6">Solusi Admin</div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li className="text-sm text-gray-400 uppercase">Dashboard</li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-2 hover:bg-gray-800 rounded"
            >
              Dashboard
            </a>
          </li>
          <li className="text-sm text-gray-400 mt-6 uppercase">Tabel</li>
          <li>
            <a
              href="/admin/layanan"
              className="flex items-center px-4 py-2 hover:bg-gray-800 rounded"
            >
              Layanan
            </a>
          </li>
          <li>
            <a
              href="/admin/galery"
              className="flex items-center px-4 py-2 hover:bg-gray-800 rounded"
            >
              Galery
            </a>
          </li>
          <li>
            <a
              href="/admin/artikel"
              className="flex items-center px-4 py-2 hover:bg-gray-800 rounded"
            >
              Artikel
            </a>
          </li>
          <li>
            <a
              href="/admin/tags"
              className="flex items-center px-4 py-2 hover:bg-gray-800 rounded"
            >
              Tags
            </a>
          </li>
          <li className="text-sm text-gray-400 uppercase">Profil Perusahaan</li>
          <li>
            <a
              href="/admin/profil-perusahaan"
              className="flex items-center px-4 py-2 hover:bg-gray-800 rounded"
            >
              Profil Perusahaan
            </a>
          </li>
        </ul>
      </nav>
      <div className="p-4 text-sm text-gray-400 border-t border-gray-800">
        © 2024 Copyright PT Solusi Koneksi Anda
      </div>
    </aside>
  );
}
