import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { inserirStatus } from "@/app/lib/StatusFunctions/libInserirStatus";
import { editarStatus } from "@/app/lib/StatusFunctions/libEditarStatus";

interface Status {
  id: number;
  nome: string;
}

interface SelectStatusProps {
  statusList: Status[];
  atualizaLista: () => void;
  setorId: number;
  setarIdStatus: (idStatus: number) => void;
  valorInicial?: Status;
}

const SelectStatus: React.FC<SelectStatusProps> = ({
  statusList,
  atualizaLista,
  setorId,
  setarIdStatus,
  valorInicial,
}) => {
  const [statusSelecionado, setStatusSelecionado] = useState<Status | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editando, setEditando] = useState<Status | null>(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [adicionando, setAdicionando] = useState(false);
  const [nomeNovoStatus, setNomeNovoStatus] = useState("");

  const popoverRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickAway(popoverRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
  });

  const acaoSelecionarStatus = (status: Status) => {
    setarIdStatus(status.id);
    setStatusSelecionado(status);
    setIsOpen(false);
  };

  const acaoEditarStatus = (status: Status) => {
    if (adicionando) {
      setNomeNovoStatus("");
      setAdicionando(false);
    }
    setEditando(status);
    setNomeEditado(status.nome);
  };

  const acaoSalvarEdicao = async (event: React.FormEvent, statusId: number) => {
    event.preventDefault();
    if (editando) {
      const statusEditado = await editarStatus(statusId, nomeEditado);
      if (statusEditado) {
        atualizaLista();
        setEditando(null);
        setNomeEditado("");
      }
    }
  };

  const acaoCancelarEditando = (event: React.FormEvent) => {
    event.preventDefault();
    setEditando(null);
    setNomeEditado("");
  };

  const acaoCancelarAdicao = (event: React.FormEvent) => {
    event.preventDefault();
    setNomeNovoStatus("");
    setAdicionando(false);
  };

  const acaoNovoStatus = () => {
    if (editando) {
      setEditando(null);
      setNomeEditado("");
    }
    setAdicionando(true);
    setNomeNovoStatus("");
  };

  const acaoSalvarNovoStatus = async (event: React.FormEvent) => {
    event.preventDefault();
    if (adicionando) {
      const novoStatus = await inserirStatus(setorId, nomeNovoStatus);
      if (novoStatus) {
        atualizaLista();
        setAdicionando(false);
        setNomeNovoStatus("");
      }
    }
  };

  useEffect(() => {
    if (valorInicial) {
      setStatusSelecionado(valorInicial);
    }
  }, [valorInicial]);
  return (
    <div className="relative w-full">
      <span className="text-white">Status</span>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-start"
      >
        {statusSelecionado ? statusSelecionado.nome : "Selecione um status"}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 w-full bg-gray-200 border border-gray-300 rounded mt-1 shadow-lg"
        >
          <ul className="max-h-60 overflow-auto">
            {statusList.length > 0 ? (
              statusList.map((status) => (
                <li
                  key={status.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-300"
                >
                  {editando && editando.id === status.id ? (
                    <form
                      onSubmit={(event) => acaoSalvarEdicao(event, status.id)}
                      className="flex items-center space-x-2 w-full"
                    >
                      <input
                        required
                        type="text"
                        value={nomeEditado}
                        onChange={(e) => setNomeEditado(e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={acaoCancelarEditando}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                      <button
                        onClick={() => acaoSelecionarStatus(status)}
                        className="text-black select-none w-full text-start"
                      >
                        {status.nome}
                      </button>
                      <button
                        onClick={() => acaoEditarStatus(status)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-500">
                Nenhum status encontrado
              </li>
            )}
          </ul>

          {adicionando ? (
            <form
              onSubmit={acaoSalvarNovoStatus}
              className="p-2 flex space-x-2"
            >
              <input
                required
                type="text"
                value={nomeNovoStatus}
                onChange={(e) => setNomeNovoStatus(e.target.value)}
                placeholder="Novo status..."
                className="w-full p-1 border border-gray-300 rounded focus:outline-none"
              />
              <button
                type="submit"
                className="text-green-500 hover:text-green-700"
              >
                <FaSave />
              </button>
              <button
                onClick={acaoCancelarAdicao}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </form>
          ) : (
            <button
              onClick={acaoNovoStatus}
              className="flex items-center justify-center w-full p-2 text-green-500 hover:text-green-700 border-t border-gray-400"
            >
              <FaPlus className="mr-2" />
              Adicionar status
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectStatus;
