"use client";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to ToDo App</h1>

        {user ? (
          <>
            <p className="mb-4">Logged in as {user.displayName || user.email}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => router.push("/register")}
              className="px-6 py-3 bg-green-600 text-black rounded hover:bg-green-700"
            >
              Auth/Log_in
            </button>
          </div>
        )}
      </main>
      <footer className="p-4 text-center text-sm text-gray-500">
        © 2025 My ToDo App
      </footer>
    </div>
  );
}
