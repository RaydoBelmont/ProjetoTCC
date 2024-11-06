"use client";
import { useSession } from "next-auth/react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const { workspacesContext } = useAppContext();
  const router = useRouter();

  const redirecionar = async (idWorkspace: number) => {
    if (typeof window !== "undefined") {
      const secretKey = String(process.env.CHAVE_CRIPTO);
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(idWorkspace),
        secretKey
      ).toString();

      router.push(`/workspace/${encodeURIComponent(encryptedData)}`);
    }
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-start p-8 bg-opacity-50 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/GAES2.png')" }}
    >
      {session && session.user ? (
        workspacesContext.length > 0 ? (
          <div className="w-full max-w-4xl mt-12">
            <h1 className="text-3xl font-bold text-white mb-6">
              Suas Workspaces:
            </h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {workspacesContext.map((workspace) => (
                <li
                  key={workspace.id}
                  className="flex flex-col items-center p-4 bg-[#1E293B] rounded-lg shadow-md text-white"
                >
                  <h2 className="text-lg font-semibold mb-4">
                    {workspace.nome}
                  </h2>
                  <button
                    onClick={() => redirecionar(workspace.id)}
                    className="mt-auto px-4 py-2 text-sm font-medium bg-teal-500 hover:bg-teal-600 rounded-md transition-colors duration-200"
                  >
                    Acessar Workspace
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center relative w-full text-white text-center">
            <h1 className="text-4xl font-bold mt-8">Crie uma Nova Workspace e começe a trabalhar!</h1>
            <p>No menu lateral crie uma nova Workspace ou peça para alguem te convidar!</p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center relative w-full text-white text-center">
          <Image
            src="/images/LOGO2.png"
            alt="Logo"
            className="object-contain"
            width={100}
            height={100}
          />
          <h1 className="text-4xl font-bold mt-8">
            GAES - Gerenciamento Avançado de Equipes de Suporte
          </h1>
          <p>Organize, planeje, acompanhe e monitore suas tarefas.</p>
        </div>
      )}
    </main>
  );
}
