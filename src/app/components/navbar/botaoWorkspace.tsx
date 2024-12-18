import React, { useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useClickAway } from "react-use";
import { workspace } from "./navbar";
import ModalCadWork from "../modals/cadWorkspace/modalCadWork";
import ModalEditarWorkspace from "../modals/cadWorkspace/modalEditarWorkspace";
import { FaEdit } from "react-icons/fa";

interface BotaoWorkspacesProps {
  workspaces: workspace[];
  attListaWorkspace: (email: string) => void;
  redirecionar: (id: number, nome: string) => void;
}

const BotaoWorkspaces: React.FC<BotaoWorkspacesProps> = ({
  workspaces,
  redirecionar,
  attListaWorkspace,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [idWorkspaceEditar, setIdWorkspaceEditar] = useState<number | null>();
  const refBtnWorkspace = useRef(null);

  useClickAway(refBtnWorkspace, () => {
    if (showOptions) {
      setShowOptions(false);
    }
  });

  const clickRedirecionar = (id: number, nome: string) => {
    redirecionar(id, nome);
    setShowOptions(false);
  };

  const acaoBotaoEditar = (idWorkspace: number) => {
    setIdWorkspaceEditar(idWorkspace)
    setIsModalEditarOpen(true)
  }

  const acaoLimparIdEditar = () => {
    setIdWorkspaceEditar(null)
  }

  return (
    <div className="relative flex" ref={refBtnWorkspace}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="text-white text-sm text-left py-2 px-3 w-full rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700"
      >
        Workspaces
        {showOptions ? (
          <IoIosArrowDown className="h-4 w-4 ml-1 inline-block transform rotate-180" />
        ) : (
          <IoIosArrowUp className="h-4 w-4 ml-1 inline-block transform rotate-180" />
        )}
      </button>
      {showOptions && (
        <div className="absolute right-0 top-0 mt-10 bg-[#212938] py-2 px-3 rounded-md shadow-2xl">
          <div className="text-white text-sm rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700">
            <button className="py-2 px-3" onClick={() => setIsModalOpen(true)}>
              + Nova Workspace
            </button>
          </div>
          {workspaces.map((workspace, index) => (
            <div
              key={index}
              className="flex justify-between text-white text-sm rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700"
            >
              <button
                className="w-full select-none py-2 px-3"
                onClick={() => clickRedirecionar(workspace.id, workspace.nome)}
              >
                {workspace.nome}
              </button>
              <button 
              onClick={() => acaoBotaoEditar(workspace.id)}
              className="p-1 h-[50%] mr-1 mt-2 hover:bg-black rounded"><FaEdit /></button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ModalCadWork
          isOpen={isModalOpen}
          setModalOpen={() => setIsModalOpen(!isModalOpen)}
          attListaWorkspace={attListaWorkspace}
        />
      )}

{isModalEditarOpen && (
  <ModalEditarWorkspace 
  isOpen={isModalEditarOpen}
  setModalOpen={() => setIsModalEditarOpen(!isModalEditarOpen)}
  attListaWorkspace={attListaWorkspace}
  idWorkspace={idWorkspaceEditar}
  setIdWorkspace={acaoLimparIdEditar}
  />
)}
      
    </div>
  );
};

export default BotaoWorkspaces;
