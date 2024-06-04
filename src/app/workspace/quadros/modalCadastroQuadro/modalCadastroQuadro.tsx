import React, { Dispatch, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";

type ModalCadastroQuadros = {
  isOpen: boolean;
  setModalOpen: () => void;
  idWorkspace: string;
};

type Quadro = {
  nome: string;
};

export default function ModalCadQuadro(props: ModalCadastroQuadros) {
  const [novoQuadro, setNovoQuadro] = useState<Quadro>({
    nome: "",
  });

  const salvarNovoQuadro = (key: string, value: string) => {
    setNovoQuadro({ ...novoQuadro, [key]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/quadros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: novoQuadro.nome,
          idWorkspace: props.idWorkspace,
        }),
      });
      alert("Cadastro realizado com sucesso!");
      props.setModalOpen();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      if (!response.ok) {
        throw new Error("Ocorreu um erro ao criar a workspace.");
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  if (props.isOpen) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-200 animate-fade-in max-w-screen-md w-full">
          <h1 className="text-sm font-semibold mb-4 text-white text-center">
            Novo Quadro
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
                value={novoQuadro.nome}
                onChange={(e) => salvarNovoQuadro("nome", e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  props.setModalOpen();
                  setNovoQuadro({ nome: "" });
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
}
