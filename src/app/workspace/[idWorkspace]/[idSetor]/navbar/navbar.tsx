import {
  Button,
  Navbar,
} from "../../../../lib/material-tailwindcss/material-tailwindcss";
import { FaFileAlt, FaPlus, FaArrowLeft, FaSearch } from "react-icons/fa"; // Importar o ícone de lupa
import { Chamado, Quadro } from "../page";
import { useState, useRef } from "react";
import { useClickAway } from "react-use";
import { useRouter } from "next/navigation"; // Importar o useRouter
import ModalRelChamadosPorStatus from "./Modals/modalRelChamadosPorStatus";
import { Cliente, Prioridade } from "../quadros/Modals/modalCadChamado";
import ModalRelChamadosPorCliente from "./Modals/modalRelChamadosPorCliente";
import ModalRelChamadosPorPrioridade from "./Modals/modalRelChamadosPorPrioridade";
import ModalPesquisaChamados from "./Modals/modalPesquisarChamados";

interface Props {
  idWorkspace: number;
  idSetor: number;
  isOpen: boolean;
  setModalOpen: () => void;
  setTipoModal: () => void;
  tipoModal?: string;
  listaChamadosPorQuadro: { [key: number]: Chamado[] };
  listaQuadros: Quadro[];
  clientes: Cliente[];
  listaPrioridades: Prioridade[];
}

export default function NavbarSetor(props: Props) {
  const router = useRouter(); // Usar o useRouter
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenModalChamadosPorStatus, setIsOpenModalChamadosPorStatus] =
    useState<boolean>(false);
  const [isOpenModalChamadosPorCliente, setIsOpenModalChamadosPorCliente] =
    useState<boolean>(false);
  const [
    isOpenModalChamadosPorPrioridade,
    setIsOpenModalChamadosPorPrioridade,
  ] = useState<boolean>(false);

  const [isModalPesquisarOpen, setIsModalPesquisarOpen] = useState(false); // Estado para controlar a pesquisa

  // useRef para o dropdown
  const dropdownRef = useRef(null);

  const acaoInserir = () => {
    props.setModalOpen();
    props.setTipoModal();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const voltarPagina = () => {
    router.back(); // Volta para a página anterior
  };

  return (
    <Navbar className="w-full max-w-full rounded-none px-4 py-2 bg-[#202938] border-none z-20">
      <div className="relative flex justify-between items-center">
        <div className="flex gap-2">
          {/* Botão de Voltar */}
          <Button
            variant="text"
            size="sm"
            onClick={voltarPagina}
            className="flex items-center gap-1 normal-case text-sm font-normal text-white bg-[#394152] hover:bg-gray-600 shadow-lg"
          >
            <FaArrowLeft />
          </Button>

          <Button
            variant="text"
            size="sm"
            onClick={acaoInserir}
            className="flex items-center gap-1 normal-case text-sm font-normal text-white bg-[#394152] hover:bg-gray-600 shadow-lg"
          >
            <FaPlus />
            Novo Quadro
          </Button>

          {/* Botão de Relatórios com dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="text"
              size="sm"
              onClick={toggleDropdown}
              className="flex items-center gap-1 normal-case text-sm font-normal text-white bg-[#394152] hover:bg-gray-600 shadow-lg"
            >
              <FaFileAlt />
              Relatórios
            </Button>

            {isDropdownOpen && (
              <div className="flex flex-col absolute mt-2 bg-[#394152] py-2 rounded-lg shadow-lg w-64 items-center">
                <button
                  onClick={() => setIsOpenModalChamadosPorStatus(true)}
                  className="px-4 py-2 text-white hover:bg-gray-600 text-start w-[90%] rounded"
                >
                  Chamados por Status
                </button>
                <button
                  onClick={() => setIsOpenModalChamadosPorCliente(true)}
                  className="px-4 py-2 text-white hover:bg-gray-600 text-start w-[90%] rounded"
                >
                  Chamados por Cliente
                </button>
                <button
                  onClick={() => setIsOpenModalChamadosPorPrioridade(true)}
                  className="px-4 py-2 text-white hover:bg-gray-600 text-start w-[90%] rounded"
                >
                  Chamados por Prioridade
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <span className="mr-1 select-none">Pesquisar...</span>
          <Button
            className="w-10 h-10 text-lg px-2 rounded-full mr-1 bg-transparent hover:bg-[#384052] hover:text-[#21d3ed] items-center text-center"
            onClick={() => setIsModalPesquisarOpen(true)}
          >
            <FaSearch className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Modal de Relatórios */}
      {isOpenModalChamadosPorStatus && (
        <ModalRelChamadosPorStatus
          isOpen={isOpenModalChamadosPorStatus}
          setModalOpen={() => setIsOpenModalChamadosPorStatus(false)}
          listaChamados={props.listaChamadosPorQuadro}
          listaQuadros={props.listaQuadros}
        />
      )}

      {isOpenModalChamadosPorCliente && (
        <ModalRelChamadosPorCliente
          isOpen={isOpenModalChamadosPorCliente}
          setModalOpen={() => setIsOpenModalChamadosPorCliente(false)}
          listaChamados={props.listaChamadosPorQuadro}
          listaQuadros={props.listaQuadros}
          listaClientes={props.clientes}
        />
      )}

      {isOpenModalChamadosPorPrioridade && (
        <ModalRelChamadosPorPrioridade
          isOpen={isOpenModalChamadosPorPrioridade}
          setModalOpen={() => setIsOpenModalChamadosPorPrioridade(false)}
          listaChamados={props.listaChamadosPorQuadro}
          listaQuadros={props.listaQuadros}
          listaPrioridades={props.listaPrioridades}
        />
      )}

      {isModalPesquisarOpen && (
        <ModalPesquisaChamados
          isOpen={isModalPesquisarOpen}
          setModalOpen={() => setIsModalPesquisarOpen(false)}
          listaChamados={props.listaChamadosPorQuadro}
          listaQuadros={props.listaQuadros}
        />
      )}
    </Navbar>
  );
}
