"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import BotaoNotificacoes from "./botaoNotificacoes";

export default function PerfilUser() {
  const { data: session } = useSession();

  if (session && session.user) {
    const partesDoNome = session.user.name ? session.user.name.split(" ") : [];
    const primeiroNome = partesDoNome.length > 0 ? partesDoNome[0] : "";
    const userImagem = session.user.image || ""; // Garanta que userImagem seja uma string

    return (
      <div className="flex items-center bg-[#202938] p-1 rounded-lg shadow-md gap-1 justify-between">
        <div className="flex justify-start items-center">
        <div className="flex p-2 ">
          {userImagem && (
            <Image
              src={userImagem}
              width={35}
              height={35}
              className="rounded-full"
              alt="Imagem de perfil"
            />
          )}
        </div>
        <div className="">
          <h2 className="text-lg font-semibold">{primeiroNome}</h2>
        </div>
        </div>

        <BotaoNotificacoes />
      </div>
    );
  }

  return null; // Retorna null se não houver sessão
}
