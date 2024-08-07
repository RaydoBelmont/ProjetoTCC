"use client";
import Link from "next/link";
import SigninButton from "./SigninButton";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState, createContext, useContext } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import BotaoModalWorkspace from "../botoes_modal/btnModalCadWork";
import { useClickAway } from "react-use";
import BotaoWorkspaces from "./botaoWorkspace";
import ToggleDarkMode from "./botaoDarkMode";

export interface workspace {
  id: number;
  nome: string;
  email: string;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [showOptions, setShowOptions] = useState(false); // Estado para controlar se as opções estão visíveis
  const refBtnWorkspace = useRef(null);
  const [workspaces, setWorkspaces] = useState<workspace[]>([]);


  const redirecionar = (id: number, nome: string) => {
    if (typeof window !== "undefined") {
      const idToString = id.toString();
      const email = session?.user?.email || "semEmail";
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("workspaceId", idToString);
      sessionStorage.setItem("workspaceName", nome);
      window.location.href = "/workspace";
    }
  };

  const listaWorkspaces = async (email: string) => {
    try {
      const response = await fetch("/api/workspace?email=" + email);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setWorkspaces(data);
      } else {
        console.error("Erro: data.workspaces é undefined ou não é um array");
      }
    } catch (error) {
      console.error("Erro ao carregar as workspaces:", error);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      let email = session?.user?.email;
      if (email) listaWorkspaces(email);
    }
  }, [session]);

  // const btWS = useCallback(
  //   (chave?: any) => (
  //     <BotaoWorkspaces
  //       key={chave}
  //       workspaces={workspaces}
  //       setWorkspaces={setWorkspaces}
  //       redirecionar={redirecionar}
  //     />
  //   ),
  //   [workspaces]
  // );

  // const botaoWorkspaces = useCallback(
  //   (chave?: any) => (
  //     <div className="relative flex " key={chave} ref={refBtnWorkspace}>
  //       <button
  //         onClick={() => setShowOptions(!showOptions)}
  //         className="text-white text-sm py-2 px-3 rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700 "
  //       >
  //         Workspaces
  //         {showOptions ? (
  //           <IoIosArrowDown className="h-5 w-5 ml-1 inline-block transform rotate-180" />
  //         ) : (
  //           <IoIosArrowUp className="h-5 w-5 ml-1 inline-block transform rotate-180" />
  //         )}
  //       </button>
  //       {showOptions && ( // Mostra as opções apenas se showOptions for verdadeiro
  //         <div className="absolute right-0 top-0 mt-10 bg-gray-700 py-2 px-3 rounded-md shadow-2xl">
  //           <div className="text-white text-sm rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700">
  //             <BotaoModalWorkspace
  //               areaDeTrabalho={workspaces}
  //               setWorkspace={setWorkspaces}
  //             />
  //           </div>
  //           {workspaces.map((workspace, index) => (
  //             <div
  //               key={index}
  //               className=" text-white text-sm rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700"
  //             >
  //               <button
  //                 className="w-full select-none py-2 px-3"
  //                 onClick={() => redirecionar(workspace.id, workspace.nome)}
  //               >
  //                 {workspace.nome}
  //               </button>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   ),
  //   [showOptions, workspaces]
  // );

  const menuItems =
    session && session.user
      ? [
          { name: "Início", link: "/" },
          { name: "Workspaces", link: "" },
          { name: "Blog", link: "/blog" },
        ]
      : [
          { name: "Início", link: "/" },
          { name: "Contato", link: "/contato" },
        ];

  return (
    <nav className="sticky top-0 z-10 flex flex-col justify-between bg-[#384052]  p-4 border-b border-gray-600 min-w-44 h-screen">
      <div className="flex flex-col gap-2">
        {menuItems.map((item, index) =>
          item.name === "Workspaces" ? (
            <BotaoWorkspaces
              key={index}
              workspaces={workspaces}
              setWorkspaces={setWorkspaces}
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
      <ToggleDarkMode />
      <div>
        <SigninButton />
      </div>
    </nav>
  );
};

export default Navbar;
