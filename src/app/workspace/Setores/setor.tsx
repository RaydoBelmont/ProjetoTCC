import { useRouter } from "next/navigation";
import { Button } from "../../lib/material-tailwindcss/material-tailwindcss";
import ModalCadSetor from "./modalCadSetor/modalCad";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

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
  const [isOpen, setIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [idSetor, setIdSetor] = useState<number>();

  const acaoAbrirModal = (tipo: string, idSetorEditar?: number) => {
    setTipoModal(tipo);
    if (idSetorEditar) {
      setIdSetor(idSetorEditar);
    }
    setIsOpen(true);
  };

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
                onClick={() => acaoAbrirModal("INSERIR")}
              >
                + Novo Setor
              </Button>
              <ModalCadSetor
                isOpen={isOpen}
                setModalOpen={() => setIsOpen(!isOpen)}
                idWorkspace={props.idWorkspace}
                atualizarSetores={props.atualizarSetores}
                tipoModal={tipoModal}
                setorId={idSetor}
              />
            </>
          )}

          {props.Setor.map((setor, index) => (
            <div key={index} className="flex ">
              <Button className="bg-[#202938] text-xl normal-case text-teal-300 w-full">
                {setor.nome}
              </Button>
              {props.isAdmin && (
                <button
                  className=" bg-[#2d96c8] text-black normal-case text-xl pl-4 pr-4 rounded-lg"
                  onClick={() => acaoAbrirModal("EDITAR", setor.id)}
                >
                  <FaEdit className="text-xl" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
