import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { Chamado, Quadro } from "../../page";

type ModalPesquisaChamadosProps = {
  isOpen: boolean;
  setModalOpen: () => void;
  listaChamados: { [key: number]: Chamado[] };
  listaQuadros: Quadro[];
};

export default function ModalPesquisaChamados(
  props: ModalPesquisaChamadosProps
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChamados, setFilteredChamados] = useState<Chamado[]>([]);
  const [searchBy, setSearchBy] = useState<"Cliente" | "Nº">("Cliente");
  const [allChamados, setAllChamados] = useState<Chamado[]>([]);

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
          return chamado.numeroSequencial
            .toString()
            .includes(searchTerm);
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
      className="bg-[#202938]"
    >
      <DialogHeader className="justify-center text-white">
        Pesquisar Chamados
      </DialogHeader>
      <DialogBody className="">
        <div className="flex gap-2 mb-4">
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as "Cliente" | "Nº")}
            className="border border-gray-300 rounded p-2"
          >
            <option value="Cliente">Cliente</option>
            <option value="Nº">Nº</option>
          </select>
          <input
            type="text"
            placeholder="Pesquise aqui..."
            className="w-full border border-gray-300 rounded p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col mt-4">
          {filteredChamados.length > 0 ? (
            filteredChamados.map((chamado) => (
              <button
                key={chamado.id}
                className="p-2 border-b border-gray-200 text-left bg-[#394152] hover:bg-gray-600"
              >
                {searchBy === "Cliente"
                  ? chamado.cliente.nome
                  : chamado.numeroSequencial}
                {" - "}
                {chamado.titulo}
              </button>
            ))
          ) : (
            searchTerm && <p>Nenhum chamado encontrado.</p>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => props.setModalOpen()}>Fechar</Button>
      </DialogFooter>
    </Dialog>
  );
}
