"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { MdOutlineLogout } from "react-icons/md";

export default function SigninButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    // Divide o nome completo em partes usando o espaço como separador
    const partesDoNome = session.user.name ? session.user.name.split(" ") : [];
    const primeiroNome = partesDoNome.length > 0 ? partesDoNome[0] : "";
    const userImagem = session.user.image || ""; // Garanta que userImagem seja uma string

    return (
      <div className="flex items-center">
        <div className="mr-4">
          {userImagem && (
            <Image
              src={userImagem}
              width={50}
              height={50}
              className="rounded-full" // Adicione a classe CSS à imagem
              alt="Imagem de perfil"
            />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold m-0">{primeiroNome}</h2>
          <button
            onClick={() => signOut()}
            className=" flex items-center pr-2  text-white m-0 rounded-md text-sm font-medium
         hover:bg-red-500 focus:outline-none"
          >
            {<MdOutlineLogout className="mr-2" />}Sair
          </button>
        </div>

        {/* <div className="flex justify-between items-center font-normal ">
          <p className="text-xs p-3">{primeiroNome}</p>

          <button
            onClick={() => signOut()}
            className="text-white py-2 px-3 rounded-md text-xs font-medium
         hover:bg-red-500 focus:outline-none focus:bg-teal-700"
          >
            Sair
          </button>
        </div> */}
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
