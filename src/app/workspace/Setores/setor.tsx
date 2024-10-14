import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../lib/material-tailwindcss/material-tailwindcss";
import ModalCadSetor from "./modals/modalCad";
import ModalGerenciarMembrosSetor from "./modals/modalMembrosSetor";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import CryptoJS from "crypto-js";
import Loading from "../[idWorkspace]/Loading";

type PropsSetor = {
  idWorkspace: number;
  nomeWorkspace: string;
  isAdmin: boolean;
  atualizarSetores: (idWorkspace: number) => void;
  Setor: {
    id: number;
    nome: string;
  }[];
};

export default function Setor(props: PropsSetor) {
  const [isOpenCadSetor, setIsOpenCadSetor] = useState(false);
  const [isOpenMembros, setIsOpenMembros] = useState(false);
  const [tipoModalSetor, setTipoModalSetor] = useState("");

  const [idSetor, setIdSetor] = useState<number>();
  const [idSetorModalMembro, setIdSetorModalMembro] = useState<number>();
  const router = useRouter();
  const pathname = usePathname();

  const acaoAbrirModalSetor = (tipo: string, idSetorEditar?: number) => {
    setTipoModalSetor(tipo);
    if (idSetorEditar) {
      setIdSetor(idSetorEditar);
    }
    setIsOpenCadSetor(true);
  };

  const acaoAbrirModalMembros = (idSetorSelecionado: number) => {
    setIdSetorModalMembro(idSetorSelecionado);
    setIsOpenMembros(true);
  };
  const redirecionar = async (idSetor: number) => {
    if (typeof window !== "undefined") {
      const secretKey = String(process.env.CHAVE_CRIPTO);
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(idSetor),
        secretKey
      ).toString();

      router.push(`${pathname}/${encodeURIComponent(encryptedData)}`);
    }
  };

  if (!props.nomeWorkspace) {
    return <Loading />;
  } else
    return (
      <div className="bg-navy-900 text-white">
        <div className="container mx-auto p-4">
          <h1 className="text-teal-300 text-3xl font-bold mb-6 text-center">
            Setores de {props.nomeWorkspace}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.isAdmin && (
              <>
                <Button
                  className="bg-[#202938] text-xl normal-case text-teal-300"
                  onClick={() => acaoAbrirModalSetor("INSERIR")}
                >
                  + Novo Setor
                </Button>
                <ModalCadSetor
                  isOpen={isOpenCadSetor}
                  setModalOpen={() => setIsOpenCadSetor(!isOpenCadSetor)}
                  idWorkspace={props.idWorkspace}
                  atualizarSetores={props.atualizarSetores}
                  tipoModal={tipoModalSetor}
                  setorId={idSetor}
                />
              </>
            )}

            {props.Setor.map((setor, index) => (
              <div key={index} className="flex ">
                <div className="flex bg-[#202938] rounded-lg w-full items-center">
                  <Button
                    onClick={() => redirecionar(setor.id)}
                    className="bg-transparent text-xl normal-case text-teal-300 w-full truncate"
                    title={setor.nome}
                  >
                    {setor.nome}
                  </Button>
                  {props.isAdmin && (
                    <button
                      className="mr-4 rounded-lg hover:bg-gray-800 p-1"
                      onClick={() => acaoAbrirModalMembros(setor.id)}
                    >
                      <IoMdPersonAdd size={18} />
                    </button>
                  )}
                </div>
                {props.isAdmin && (
                  <button
                    className=" bg-[#2d96c8] text-black normal-case text-xl pl-4 pr-4 rounded-lg"
                    onClick={() => acaoAbrirModalSetor("EDITAR", setor.id)}
                  >
                    <FaEdit className="text-xl" />
                  </button>
                )}
              </div>
            ))}

            {isOpenMembros ? (
              <ModalGerenciarMembrosSetor
                isOpen={isOpenMembros}
                setModalOpen={() => setIsOpenMembros(!isOpenMembros)}
                idSetor={idSetorModalMembro}
                workspaceId={props.idWorkspace}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
}
