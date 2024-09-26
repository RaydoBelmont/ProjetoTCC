import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { inserirPrioridade } from "@/app/lib/PrioridadesFunctions/libInserirPrioridade";
import { editarPrioridade } from "@/app/lib/PrioridadesFunctions/libEditarPrioridade";

interface Prioridade {
  id: number;
  nome: string;
}

interface SelectPrioridadesProps {
  listaPrioridades: Prioridade[];
  atualizaLista: () => void;
  setorId: number;
  setarIdPrioridade: (idStatus: number) => void

}

const SelectPrioridades: React.FC<SelectPrioridadesProps> = ({
  listaPrioridades,
  atualizaLista,
  setorId,
  setarIdPrioridade,
}) => {
  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState<Prioridade | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [editando, setEditando] = useState<Prioridade | null>(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [adicionando, setAdicionando] = useState(false);
  const [nomeNovaPrioridade, setNomeNovaPrioridade] = useState("");

  const popoverRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickAway(popoverRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
  });

  const acaoSelecionarPrioridade = (prioridade: Prioridade) => {
    setarIdPrioridade(prioridade.id)
    setPrioridadeSelecionada(prioridade);
    setIsOpen(false);
  };

  const acaoEditarPrioridade = (prioridade: Prioridade) => {
    if (adicionando) {
      setNomeNovaPrioridade("");
      setAdicionando(false);
    }
    setEditando(prioridade);
    setNomeEditado(prioridade.nome);
  };

  const acaoSalvarEdicao = async (event: React.FormEvent, prioridadeId: number) => {
    event.preventDefault();
    if (editando) {
      const prioridadeEditado = await editarPrioridade(prioridadeId, nomeEditado)
      if(prioridadeEditado){
        atualizaLista()
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
    setNomeNovaPrioridade("");
    setAdicionando(false);
  };

  const acaoNovaPrioridade = () => {
    if (editando) {
      setEditando(null);
      setNomeEditado("");
    }
    setAdicionando(true);
    setNomeNovaPrioridade("");
  };

  const acaoSalvarNovaPrioridade =  async (event: React.FormEvent) => {
    event.preventDefault();
    if (adicionando) {
      const novaPrioridade = await inserirPrioridade(setorId, nomeNovaPrioridade)
      if(novaPrioridade){
        atualizaLista()
        setAdicionando(false);
        setNomeNovaPrioridade("");
      }
    }
  };

  return (
    <div className="relative w-full">
      <span className="text-white">Prioridade</span>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-start"
      >
        {prioridadeSelecionada ? prioridadeSelecionada.nome : "Selecione uma Prioridade"}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 w-full bg-gray-200 border border-gray-300 rounded mt-1 shadow-lg"
        >
          <ul className="max-h-60 overflow-auto">
            {listaPrioridades.length > 0 ? (
              listaPrioridades.map((status) => (
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
                        onClick={() => acaoSelecionarPrioridade(status)}
                        className="text-black select-none w-full text-start"
                      >
                        {status.nome}
                      </button>
                      <button
                        onClick={() => acaoEditarPrioridade(status)}
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
                Nenhuma prioridade encontrada.
              </li>
            )}
          </ul>

          {adicionando ? (
            <form
              onSubmit={acaoSalvarNovaPrioridade}
              className="p-2 flex space-x-2"
            >
              <input
                required
                type="text"
                value={nomeNovaPrioridade}
                onChange={(e) => setNomeNovaPrioridade(e.target.value)}
                placeholder="Nova Prioridade..."
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
              onClick={acaoNovaPrioridade}
              className="flex items-center justify-center w-full p-2 text-green-500 hover:text-green-700 border-t border-gray-400"
            >
              <FaPlus className="mr-2" />
              Adicionar prioridade
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectPrioridades;
