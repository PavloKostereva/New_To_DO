"use client";

import { useAuth } from "../components/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/register");
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>Welcome, {user.displayName || user.email}</div>
      <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  );
}
