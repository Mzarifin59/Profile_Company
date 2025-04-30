"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Fetch admin credentials from API
      const response = await fetch("http://localhost:5000/api/admin");
      
      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }
      
      const adminData = await response.json();
      
      // Find matching admin
      const admin = adminData.find(
        (admin: { username: string; password: string }) => 
          admin.username === username && admin.password === password
      );
      
      if (admin) {
        // Use the auth context to login
        login("logged_in", admin.username);
        router.push("/admin");
      } else {
        setError("Username atau password salah");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada server. Silakan coba lagi.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-md shadow-md p-8 w-full max-w-sm text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-2">
            <img src="/logo.png" alt="Logo" className="w-full h-full" />
          </div>
          <h2 className="text-xl font-medium">Login Admin</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold text-sm"
            disabled={loading}
          >
            {loading ? "LOADING..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}