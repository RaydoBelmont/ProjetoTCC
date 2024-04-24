"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Cookies from "js-cookie";
import Image from "next/image";

export default function SigninButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    // Divide o nome completo em partes usando o espaço como separador
    const partesDoNome = session.user.name ? session.user.name.split(" ") : [];
    const primeiroNome = partesDoNome.length > 0 ? partesDoNome[0] : "";
    const userImagem = session.user.image || ""; // Garanta que userImagem seja uma string

    return (
      <div className="flex flex-col gap-4 ml-auto items-center">
        <p className="text-sky-600 overflow-hidden max-w-full">Bem vindo </p>
        <p>{primeiroNome}</p>
        {userImagem && (
          <div className="w-16 h-16 relative">
            <Image
              src={userImagem}
              layout="fill"
              className="rounded-full" // Adicione a classe CSS à imagem
              alt="Imagem de perfil"
            />
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="text-white py-2 px-3 rounded-md text-base font-medium
         hover:bg-red-500 focus:outline-none focus:bg-teal-700"
        >
          Sair
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => signIn()}
      className="text-white py-2 px-3 rounded-md text-base font-medium
         hover:bg-teal-500 focus:outline-none focus:bg-teal-700"
    >
      Entrar
    </button>
  );
}
