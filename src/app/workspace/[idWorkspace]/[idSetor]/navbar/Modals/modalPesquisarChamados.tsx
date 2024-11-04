import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Chip,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { Chamado, Quadro } from "../../page";

type ModalPesquisaChamadosProps = {
  isOpen: boolean;
  setModalOpen: () => void;
  listaChamados: { [key: number]: Chamado[] };
  listaQuadros: Quadro[];
  acaoAbrirChamado: (chamado: Chamado) => void;
};

export default function ModalPesquisaChamados(
  props: ModalPesquisaChamadosProps
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChamados, setFilteredChamados] = useState<Chamado[]>([]);
  const [searchBy, setSearchBy] = useState<"Cliente" | "Nº">("Cliente");
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);

  const acaoBotaoChamado = (chamado: Chamado) => {
    props.setModalOpen();
    props.acaoAbrirChamado(chamado);
  };

  const formatarData = (dataCriacao: Date) => {
    const data = new Date(dataCriacao);
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${dataFormatada}`;
  };

  // Consolidando todos os chamados em uma lista única
  useEffect(() => {
    const mergedChamados = Object.values(props.listaChamados).flat();
    setAllChamados(mergedChamados);
  }, [props.listaChamados]);

  // Filtrando chamados conforme o termo e opção de pesquisa
  useEffect(() => {
    if (searchTerm) {
      const results = allChamados.filter((chamado) => {
        if (searchBy === "Cliente") {
          return chamado.cliente.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        } else if (searchBy === "Nº") {
          // Compara estritamente o número digitado com o númeroSequencial do chamado
          return chamado.numeroSequencial.toString() === searchTerm;
        }
        return false;
      });
      setFilteredChamados(results);
    } else {
      setFilteredChamados([]); // Limpa a lista quando o termo de pesquisa está vazio
    }
  }, [searchTerm, searchBy, allChamados]);
  return (
    <Dialog
      open={props.isOpen}
      handler={props.setModalOpen}
      className="bg-[#202938] max-h-[95vh]"
    >
      <DialogHeader className="justify-center text-white">
        Pesquisar Chamados
      </DialogHeader>
      <DialogBody className="flex flex-col">
        {/* Barra de Pesquisa Fixa */}
        <div className="flex gap-2 mb-4 sticky top-0 bg-[#202938] z-10">
          <div className="flex flex-col max-w-24 w-full h-full">
            <span className="text-white">Filtro</span>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as "Cliente" | "Nº")}
              className="border border-gray-300 rounded px-2 py-[11.5px] h-full text-black"
            >
              <option value="Cliente">Cliente</option>
              <option value="Nº">Nº</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-white">Pesquisar</span>
            <input
              type="text"
              placeholder="Pesquise aqui..."
              className="w-full border border-gray-300 rounded p-2 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Chamados Rolável */}
        <div className="flex flex-col mt-4 gap-2 max-h-[55vh] overflow-y-auto custom-scrollbar pr-2 rounded-lg">
          {filteredChamados.length > 0
            ? filteredChamados.map((chamado) => (
                <div key={chamado.numeroSequencial} className="pt-1">
                  <div className="flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <Chip
                          value={formatarData(chamado.criadoEm)}
                          className="text-[11px] py-1 px-2 mb-1 bg-blue-gray-600 text-white"
                        />
                        {/* Mostrar o status do chamado */}
                        {(() => {
                          switch (chamado.status) {
                            case "EM_ABERTO":
                              return (
                                <Chip
                                  value="Em Aberto"
                                  className="text-[11px] py-1 px-2 mb-1 bg-green-800 normal-case"
                                />
                              );
                            case "EM_ANALISE":
                              return (
                                <Chip
                                  value="Em Análise"
                                  className="text-[11px] py-1 px-2 mb-1 bg-yellow-900 normal-case"
                                />
                              );
                            case "EM_ANDAMENTO":
                              return (
                                <Chip
                                  value="Em Andamento"
                                  className="text-[11px] py-1 px-2 mb-1 bg-blue-600 normal-case"
                                />
                              );
                            case "CONCLUIDO":
                              return (
                                <Chip
                                  value="Concluído"
                                  className="text-[11px] py-1 px-2 mb-1 bg-green-500 normal-case"
                                />
                              );
                            case "CANCELADO":
                              return (
                                <Chip
                                  value="Cancelado"
                                  className="text-[11px] py-1 px-2 mb-1 bg-red-600 normal-case"
                                />
                              );
                            default:
                              return null;
                          }
                        })()}
                        <Chip
                          value={chamado.prioridade.nome}
                          className="text-[11px] py-1 px-2 mb-1 bg-blue-gray-600 text-white"
                        />
                      </div>
                      <Chip
                        value={`# ${chamado.numeroSequencial}`}
                        className="text-[11px] py-1 px-2 mb-1 select-text"
                      />
                    </div>
                    <button
                      key={chamado.id}
                      onClick={() => acaoBotaoChamado(chamado)}
                      className="flex flex-col justify-start normal-case text-sm font-normal bg-[#394152] text-white p-2 rounded-lg hover:bg-gray-600 max-h-[100px] overflow-y-auto w-full"
                    >
                      <Typography variant="small">
                        <span className="font-bold">Cliente: </span>
                        {chamado.cliente.nome}
                      </Typography>
                      <div className="flex flex-start items-start gap-1">
                        <span className="font-bold">Titulo:</span>
                        <p className="whitespace-normal break-all text-start">
                          {chamado.titulo}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              ))
            : searchTerm && (
                <p className="text-white">Nenhum chamado encontrado.</p>
              )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={() => props.setModalOpen()}>
          Fechar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
