"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaCog } from 'react-icons/fa'; // Biblioteca de ícones para o botão de configurações

export default function PerfilUser() {
  const { data: session } = useSession();

  if (session && session.user) {
    const partesDoNome = session.user.name ? session.user.name.split(" ") : [];
    const primeiroNome = partesDoNome.length > 0 ? partesDoNome[0] : "";
    const userImagem = session.user.image || ""; // Garanta que userImagem seja uma string

    return (
      <div className="flex items-center bg-[#202938] p-4 rounded-lg shadow-md gap-1">
        <div className="mr-4">
          {userImagem && (
            <Image
              src={userImagem}
              width={50}
              height={50}
              className="rounded-full"
              alt="Imagem de perfil"
            />
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-lg font-semibold">{primeiroNome}</h2>
        </div>
      </div>
    );
  }

  return null; // Retorna null se não houver sessão
}
