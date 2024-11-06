"use client";
import Link from "next/link";
import SigninButton from "./SigninButton";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import BotaoWorkspaces from "./botaoWorkspace";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import PerfilUser from "./perfilUser";
import Image from "next/image";
import { useAppContext } from "../../../context/AppContext";

export interface workspace {
  id: number;
  nome: string;
  email: string;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const { workspacesContext, setWorkspacesContext } = useAppContext();
  const [showOptions, setShowOptions] = useState(false);
  const refBtnWorkspace = useRef(null);
  const [workspaces, setWorkspaces] = useState<workspace[]>([]);
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

  const listaWorkspaces = async (email: string) => {
    try {
      const response = await fetch("/api/workspace?email=" + email);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setWorkspacesContext(data)
        setWorkspaces(data);
      } else {
        console.error("Erro: data.workspaces é undefined ou não é um array");
      }
    } catch (error) {
      console.error("Erro ao carregar as workspaces:", error);
    }
  };

  useClickAway(refBtnWorkspace, () => {
    setShowOptions(false);
  });

  useEffect(() => {
    if (session && session.user) {
      let email = String(session.user.email);
      if (email) listaWorkspaces(email);
    }
  }, [session]);

  const menuItems =
    session && session.user
      ? [
          { name: "Início", link: "/" },
          { name: "Workspaces", link: "" },
        ]
      : [{ name: "Início", link: "/" }];

  return (
    <nav className="sticky top-0 z-10 flex flex-col justify-between bg-[#384052]  p-4 border-b border-gray-600 min-w-44 min-h-screen">
      <div className="flex flex-col gap-2">
        <PerfilUser
        attListaWorkspace={listaWorkspaces}
        />
        {session && session.user ? (
          <div className="border-b border-gray-400 my-4"></div>
        ) : (
          <div className="flex items-center bg-[#202938] p-1 rounded-lg shadow-md gap-4 justify-start w-full">
            <div className="flex p-2 justify-between items-center">
              <Image
                src="/images/LOGO2.png"
                width={35}
                height={35}
                className="rounded-full"
                alt="Imagem Logo"
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">GAES</h2>
            </div>
          </div>
        )}
        {menuItems.map((item, index) =>
          item.name === "Workspaces" ? (
            <BotaoWorkspaces
              key={index}
              workspaces={workspaces}
              attListaWorkspace={listaWorkspaces}
              redirecionar={redirecionar}
            />
          ) : (
            <Link
              key={index}
              href={item.link}
              className="text-white text-sm py-2 px-3 rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700"
            >
              {item.name}
            </Link>
          )
        )}
      </div>
      <div className="pb-2">
        <SigninButton />
      </div>
    </nav>
  );
};

export default Navbar;
