import React, { Dispatch, SetStateAction, useState } from "react";
import { handleSaveWorkspace } from "../../../../../controllers/Workspace/workspaceController";
import { useSession } from "next-auth/react";
import { workspace } from "../../navbar/navbar";

type ModalCadWorkProps = {
  isOpen: boolean;
  setModalOpen: () => void;
  areaDeTrabalho: workspace[];
  setWorkspace: Dispatch<SetStateAction<workspace[]>>;
};

const ModalCadWork: React.FC<ModalCadWorkProps> = ({
  isOpen,
  setModalOpen,
  areaDeTrabalho,
  setWorkspace,
}) => {
  const [newWorkspace, setNewWorkspace] = useState({
    nome: "",
  });

  const handleChange = (key: string, value: string) => {
    setNewWorkspace({ ...newWorkspace, [key]: value });
    console.log(newWorkspace);
  };

  const { data: session } = useSession();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: newWorkspace.nome,
          email: session?.user?.email,
        }),
      });

      if (response.ok) {
        const dados = await response.json();
        const novoWorkspace = {
          id: dados.id,
          nome: dados.nome,
          email: session?.user?.email || "",
        };
        setWorkspace([...areaDeTrabalho, novoWorkspace]);
        alert("Cadastro realizado com sucesso!");
        setModalOpen();
      } else if (!response.ok) {
        throw new Error("Ocorreu um erro ao criar a workspace.");
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  if (isOpen) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 ">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-200 animate-fade-in max-w-screen-md w-full">
          <h1 className="text-sm font-semibold mb-4 text-white text-center">
            Nova Workspace
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nome" className="text-white block mb-2">
                Nome:
              </label>
              <input
                type="text"
                id="nome"
                className="formControl text-black w-full px-4 py-2 rounded border focus:outline-none focus:border-gray-400"
                value={newWorkspace.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setModalOpen();
                  setNewWorkspace({ nome: "" });
                }}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default ModalCadWork;
