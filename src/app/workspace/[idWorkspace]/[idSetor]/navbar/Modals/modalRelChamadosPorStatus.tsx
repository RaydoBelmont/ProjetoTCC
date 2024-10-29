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
import BotaoRelatorioChamadosGeral from "../botaoGerarRelatorioPorStatus";
import { useClickAway } from "react-use";

type propsChamadosPorStatus = {
  isOpen: boolean;
  setModalOpen: () => void;
  listaChamados: { [key: number]: Chamado[] };
  listaQuadros: Quadro[];
};

export default function ModalRelChamadosPorStatus({
  isOpen,
  setModalOpen,
  listaChamados,
  listaQuadros,
}: propsChamadosPorStatus) {
  const [todosStatus, setTodosStatus] = useState<boolean>(false);
  const [todosQuadros, setTodosQuadros] = useState<boolean>(false);
  const [statusSelecionado, setStatusSelecionado] = useState<string>("");
  const [statusSelecionadoNome, setStatusSelecionadoNome] =
    useState<string>("");
  const [relResumido, setRelResumido] = useState<boolean>(false);
  const [isDataFilterOpen, setIsDataFilterOpen] = useState(false);
  const [dataInicial, setDataInicial] = useState<string | null>("");
  const [dataFinal, setDataFinal] = useState<string | null>("");

  const [quadroSelecionado, setQuadroSelecionado] = useState<Quadro | null>(
    null
  );

  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isQuadroDropdownOpen, setQuadroDropdownOpen] = useState(false);

  const statusDropdownRef = useRef(null);
  const quadroDropdownRef = useRef(null);

  useClickAway(statusDropdownRef, () => setStatusDropdownOpen(false));
  useClickAway(quadroDropdownRef, () => setQuadroDropdownOpen(false));

  // Ação ao clicar no botão cancelar
  const acaoBotaoCancelar = () => {
    setModalOpen();
  };

  // Lógica para lidar com a seleção do checkbox "Todos"
  const acaoCheckBoxStatus = () => {
    setTodosStatus(!todosStatus);
    if (!todosStatus) {
      setStatusSelecionado(""); // Limpa o select quando "Todos" é marcado
    }
  };

  const acaoCheckBoxQuadros = () => {
    setTodosQuadros(!todosQuadros);
    if (!todosQuadros) {
      setQuadroSelecionado(null); // Limpa o select quando "Todos" é marcado
    }
  };

  const selecionarStatus = (status: string, nome: string) => {
    setStatusSelecionado(status);
    setStatusSelecionadoNome(nome);
    setStatusDropdownOpen(false);
  };

  const selecionarQuadro = (quadro: Quadro) => {
    setQuadroSelecionado(quadro);
    setQuadroDropdownOpen(false);
  };

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
            Chamados por Status
          </Typography>

          {/* Select customizado para Status */}
          <div className="flex items-center mt-4">
            <strong className="text-white font-bold text-lg mr-2">
              Status:
            </strong>
            <Checkbox
              label="Todos"
              crossOrigin={""}
              labelProps={{ className: "text-white mr-2" }}
              onChange={acaoCheckBoxStatus}
              checked={todosStatus}
            />
            <div ref={statusDropdownRef} className="relative w-full">
              <button
                onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)}
                disabled={todosStatus}
                className={`w-full bg-white text-black p-2 mt-2 rounded cursor-pointer ${
                  todosStatus ? "opacity-50" : ""
                } `}
              >
                {statusSelecionadoNome || "Selecione um status"}
              </button>
              {isStatusDropdownOpen && (
                <ul className="absolute w-full bg-white text-black rounded mt-2 z-10">
                  {[
                    { nome: "Em Aberto", value: "EM_ABERTO" },
                    { nome: "Em Análise", value: "EM_ANALISE" },
                    { nome: "Em Espera", value: "EM_ESPERA" },
                    { nome: "Em Andamento", value: "EM_ANDAMENTO" },
                    { nome: "Concluído", value: "CONCLUIDO" },
                  ].map((status, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        selecionarStatus(status.value, status.nome)
                      }
                      className="p-2 cursor-pointer hover:bg-gray-300"
                    >
                      {status.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Select customizado para Quadros */}
          <div className="flex items-center mt-4">
            <strong className="text-white font-bold text-lg">Quadro:</strong>
            <Checkbox
              label="Todos"
              crossOrigin={""}
              labelProps={{ className: "text-white mr-2" }}
              onChange={acaoCheckBoxQuadros}
              checked={todosQuadros}
            />
            <div ref={quadroDropdownRef} className="relative w-full">
              <button
                onClick={() => setQuadroDropdownOpen(!isQuadroDropdownOpen)}
                disabled={todosQuadros}
                className={`w-full bg-white text-black p-2 mt-2 rounded cursor-pointer ${
                  todosQuadros ? "opacity-50" : ""
                } `}
              >
                {quadroSelecionado?.nome || "Selecione um quadro"}
              </button>
              {isQuadroDropdownOpen && (
                <ul className="absolute w-full bg-white text-black rounded mt-2 z-10 overflow-y-auto max-h-40">
                  {listaQuadros.map((quadro) => (
                    <li
                      key={quadro.id}
                      onClick={() => selecionarQuadro(quadro)}
                      className="p-2 cursor-pointer hover:bg-gray-300"
                    >
                      {quadro.nome}
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
          {/* Passando os filtros para o botão de relatório */}
          <BotaoRelatorioChamadosGeral
            dados={listaChamados}
            statusSelecionado={todosStatus ? null : statusSelecionado}
            idQuadro={quadroSelecionado?.id}
            todosQuadros={todosQuadros}
            todosStatus={todosStatus}
            listaQuadros={listaQuadros}
            dataInicial={dataInicial}
            dataFinal={dataFinal}
            resumido={relResumido}
          />
          <Button variant="gradient" color="red" onClick={acaoBotaoCancelar}>
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
