// src/app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("google");
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center ">
      <div className="flex-col  bg-white p-8 rounded-lg shadow-lg w-full  max-w-sm">
        <p className="text-gray-600 mb-4 text-center">
          Acesse com sua conta do Google!
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-colors duration-300`}
        >
          {loading ? "Loading..." : "Fazer login com Google"}
        </button>
      </div>
    </main>
  );
}
