"use client";

import React, { useState } from "react";
import { auth, googleProvider } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        setMessage(`Користувач зареєстрований: ${userCredential.user.email}`);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setMessage(`Вітаємо, увійшли як: ${userCredential.user.email}`);
      }

      // 🔁 Переадресація після входу або реєстрації
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setMessage(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setMessage(`Успішний вхід через Google: ${result.user.email}`);
      router.push("/dashboard"); // 🔁 Перенаправлення після Google логіну
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-black">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        {isRegister ? "Реєстрація" : "Авторизація"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-sm font-medium">FullName</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Пароль</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition"
        >
          {isRegister ? "Зареєструватися" : "Увійти"}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
            setMessage(null);
          }}
          className="text-blue-600 hover:underline"
        >
          {isRegister ? "Вже є акаунт? Увійти" : "Немає акаунту? Зареєструватися"}
        </button>
      </div>

      <div className="my-4 text-center text-gray-500">або</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
      >
        Увійти через Google
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {message && <p className="text-green-600 mt-4">{message}</p>}
    </div>
  );
};

export default AuthPage;
