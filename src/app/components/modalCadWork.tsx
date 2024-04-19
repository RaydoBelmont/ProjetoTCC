import React, { useState } from "react";
import { handleSaveWorkspace } from "../../../controllers/workspaceController";
import { useSession } from "next-auth/react";

interface ModalCadWorkProps {
  isOpen: boolean;
  setModalOpen: () => void;
  

}

const ModalCadWork: React.FC<ModalCadWorkProps> = ({
  isOpen,
  setModalOpen,

}) => {
  const [workspace, setWorkspace] = useState({
    nome: "",
  });

  const handleChange = (key: string, value: string) => {
    setWorkspace({ ...workspace, [key]: value });
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
        body: JSON.stringify({ nome: workspace.nome, email: session?.user?.email }),
      });
      alert("Cadastro realizado com sucesso!");
      setModalOpen();
      setWorkspace({nome: ""})

      if (!response.ok) {
        throw new Error("Ocorreu um erro ao criar a workspace.");
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  if (isOpen) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-200 animate-fade-in max-w-screen-md w-full">
          <h1 className="text-2xl font-semibold mb-4 text-white text-center">
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
                value={workspace.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
              type="button"
                onClick={() => {setModalOpen(); setWorkspace({nome: ""})}}
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
