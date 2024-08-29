"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { MdOutlineLogout } from "react-icons/md";

export default function SigninButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center w-full">
        <div>
          <button
            onClick={() => signOut()}
            className="flex items-center text-white text-md text-left py-2 px-3 w-full rounded-md font-normal hover:bg-red-700 focus:outline-none focus:bg-teal-700"
          >
            {<MdOutlineLogout className="mr-2" />}Sair
          </button>
        </div>
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
