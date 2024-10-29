import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";

interface Status {
  id: number;
  nome: string;
  value: StatusEnum;
}

interface SelectStatusProps {
  setorId: number;
  setarStatus: (status: string) => void;
  valorInicial?: string;
  isDisabled?: boolean;
}

export enum StatusEnum {
  EmAberto = "EM_ABERTO",
  EmAnalise = "EM_ANALISE",
  EmEspera = "EM_ESPERA",
  EmAndamento = "EM_ANDAMENTO",
  Concluido = "CONCLUIDO",
  Cancelado = "CANCELADO",
}

export const statusOptions = [
  { id: 1, nome: "Em Aberto", value: StatusEnum.EmAberto },
  { id: 2, nome: "Em Analise", value: StatusEnum.EmAnalise },
  { id: 3, nome: "Em Espera", value: StatusEnum.EmEspera },
  { id: 4, nome: "Em Andamento", value: StatusEnum.EmAndamento },
  { id: 5, nome: "Concluido", value: StatusEnum.Concluido },
  { id: 6, nome: "Cancelado", value: StatusEnum.Cancelado },
];

const SelectStatus: React.FC<SelectStatusProps> = ({
  setarStatus,
  valorInicial,
  isDisabled = false, // Propriedade isDisabled com valor padrão
}) => {
  const [statusSelecionado, setStatusSelecionado] = useState<Status | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const statusList = statusOptions;

  const popoverRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickAway(popoverRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
  });

  const acaoSelecionarStatus = (status: Status) => {
    if (!isDisabled) {
      setarStatus(status.value);
      setStatusSelecionado(status);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (valorInicial) {
      const statusInicial = statusOptions.find((s) => s.value === valorInicial);
      setStatusSelecionado(statusInicial);
    }
  }, [valorInicial]);

  return (
    <div className="relative w-full">
      <span className="text-white">Status</span>
      <button
        ref={buttonRef}
        onClick={() => !isDisabled && setIsOpen((prev) => !prev)}
        className={`w-full p-2 border border-gray-300 rounded focus:outline-none text-white text-start ${
          isDisabled
            ? "cursor-not-allowed"
            : "focus:ring-2 focus:ring-indigo-500"
        }`}
        disabled={isDisabled} // Desativa o botão quando isDisabled é verdadeiro
      >
        {statusSelecionado ? statusSelecionado.nome : "Selecione um status"}
      </button>

      {isOpen && !isDisabled && (
        <div
          ref={popoverRef}
          className="absolute z-10 w-full bg-gray-200 border border-gray-300 rounded mt-1 shadow-lg"
        >
          <ul className="max-h-60 overflow-auto">
            {statusList.length > 0 ? (
              statusList.map((status) =>
                status.nome !== "Concluido" && status.nome !== "Cancelado" ? (
                  <li
                    key={status.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-300"
                  >
                    {
                      <div className="flex justify-between items-center w-full">
                        <button
                          onClick={() => acaoSelecionarStatus(status)}
                          className="text-black select-none w-full text-start"
                        >
                          {status.nome}
                        </button>
                      </div>
                    }
                  </li>
                ) : null
              )
            ) : (
              <li className="p-2 text-center text-gray-500">
                Nenhum status encontrado
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectStatus;
