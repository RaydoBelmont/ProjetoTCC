import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  CardFooter,
  Checkbox,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { Chamado, Quadro } from "../../page";
import { useClickAway } from "react-use";
import BotaoRelatorioChamadosPorPrioridade from "../botaoGerarRelChamadosPorPrioridade";
import { Prioridade } from "../../quadros/Modals/modalCadChamado";

type propsChamadosPorPrioridade = {
  isOpen: boolean;
  setModalOpen: () => void;
  listaChamados: { [key: number]: Chamado[] };
  listaQuadros: Quadro[];
  listaPrioridades: Prioridade[];
};

export default function ModalRelChamadosPorPrioridade({
  isOpen,
  setModalOpen,
  listaChamados,
  listaQuadros,
  listaPrioridades,
}: propsChamadosPorPrioridade) {
  const [todasPrioridades, setTodasPrioridades] = useState<boolean>(false);
  const [prioridadeSelecionada, setPrioridadeSelecionada] =
    useState<Prioridade>(null);
  const [relResumido, setRelResumido] = useState<boolean>(false);

  const [isPrioridadeDropdownOpen, setPrioridadeDropdownOpen] = useState(false);
  const [isDataFilterOpen, setIsDataFilterOpen] = useState(false);

  const [dataInicial, setDataInicial] = useState<string | null>("");
  const [dataFinal, setDataFinal] = useState<string | null>("");

  const prioridadeDropdownRef = useRef(null);
  useClickAway(prioridadeDropdownRef, () => setPrioridadeDropdownOpen(false));

  // Função para lidar com o checkbox "Todos"
  const acaoCheckBoxPrioridades = () => {
    setTodasPrioridades(!todasPrioridades);
    if (!todasPrioridades) setPrioridadeSelecionada(null);
  };

  const selecionarPrioridade = (prioridade: Prioridade) => {
    setPrioridadeSelecionada(prioridade);
    setPrioridadeDropdownOpen(false);
  };

  // Função para controlar o filtro de data
  const acaoBotaoFiltroData = () => {
    setIsDataFilterOpen(!isDataFilterOpen);
      setDataInicial(null);
      setDataFinal(null);
  };

  const acaoCheckBoxResumido = () => {
    setRelResumido(!relResumido);
  };

  // Desabilitar a digitação direta e configurar a seleção apenas pelo calendário
  const onFocusDesativarDigitacao = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.showPicker && e.target.showPicker(); // Abre o calendário
  };

  return (
    <Dialog
      size="md"
      open={isOpen}
      handler={setModalOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max bg-[#384152]">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="white">
            Chamados por Prioridade
          </Typography>

          {/* Select customizado para Prioridade */}
          <div className="flex items-center mt-4">
            <strong className="text-white font-bold text-lg mr-2">
              Prioridade:
            </strong>
            <Checkbox
              label="Todos"
              crossOrigin={""}
              labelProps={{ className: "text-white mr-2" }}
              onChange={acaoCheckBoxPrioridades}
              checked={todasPrioridades}
            />
            <div ref={prioridadeDropdownRef} className="relative w-full">
              <button
                onClick={() =>
                  setPrioridadeDropdownOpen(!isPrioridadeDropdownOpen)
                }
                disabled={todasPrioridades}
                className={`w-full bg-white text-black p-2 mt-2 rounded cursor-pointer ${
                  todasPrioridades ? "opacity-50" : ""
                }`}
              >
                {prioridadeSelecionada
                  ? prioridadeSelecionada.nome
                  : "Selecione uma prioridade"}
              </button>
              {isPrioridadeDropdownOpen && (
                <ul className="absolute w-full bg-white text-black rounded mt-2 z-10">
                  {listaPrioridades.map((prioridade, index) => (
                    <li
                      key={index}
                      onClick={() => selecionarPrioridade(prioridade)}
                      className="p-2 cursor-pointer hover:bg-gray-300"
                    >
                      {prioridade.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Filtro por Data */}
          <div className="flex items-center mt-4 gap-4">
            <button
              className="bg-white text-black p-2 rounded mt-7"
              onClick={acaoBotaoFiltroData}
            >
              {isDataFilterOpen ? "Fechar Filtro" : "Filtrar por Data"}
            </button>

            {isDataFilterOpen && (
              <div className="flex gap-4">
                <div>
                  <label className="text-white font-bold text-lg">
                    Data Inicial:
                  </label>
                  <input
                    type="date"
                    className="bg-white text-black p-2 rounded w-full"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                    onFocus={onFocusDesativarDigitacao}
                  />
                </div>
                <div>
                  <label className="text-white font-bold text-lg">
                    Data Final:
                  </label>
                  <input
                    type="date"
                    className="bg-white text-black p-2 rounded w-full"
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                    onFocus={onFocusDesativarDigitacao}
                  />
                </div>
              </div>
            )}
          </div>
          <Checkbox
            label="Resumido"
            crossOrigin={""}
            labelProps={{ className: "text-white mr-2" }}
            onChange={acaoCheckBoxResumido}
            checked={relResumido}
          />
        </CardBody>

        <CardFooter className="pt-0 flex justify-end space-x-2">
          <BotaoRelatorioChamadosPorPrioridade
            dados={listaChamados}
            listaQuadros={listaQuadros}
            prioridadeSelecionada={prioridadeSelecionada}
            dataInicial={dataInicial}
            dataFinal={dataFinal}
            resumido={relResumido}
          />
          <Button variant="gradient" color="red" onClick={setModalOpen}>
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
