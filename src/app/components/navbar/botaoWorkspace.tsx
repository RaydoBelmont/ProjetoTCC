import React, { useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import BotaoModalWorkspace from "../botoes_modal/btnModalCadWork";
import { useClickAway } from "react-use";
import { workspace } from "./navbar";
import { motion } from "framer-motion";

interface BotaoWorkspacesProps {
  workspaces: workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<workspace[]>>;
  redirecionar: (id: number, nome: string) => void;
}

const BotaoWorkspaces: React.FC<BotaoWorkspacesProps> = ({
  workspaces,
  setWorkspaces,
  redirecionar,
}) => {
  const [showOptions, setShowOptions] = useState(false);
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

  return (
    <div className="relative flex" ref={refBtnWorkspace}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="text-white text-sm text-left py-2 px-3 w-full rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700 "
      >
        Workspaces
        {showOptions ? (
          <IoIosArrowDown className="h-4 w-4 ml-1 inline-block transform rotate-180" />
        ) : (
          <IoIosArrowUp className="h-4 w-4 ml-1 inline-block transform rotate-180" />
        )}
      </button>
      {showOptions && (
        <motion.div
          className="absolute right-0 top-0 mt-10 bg-[#212938] py-2 px-3 rounded-md shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white text-sm rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700">
            <BotaoModalWorkspace
              areaDeTrabalho={workspaces}
              setWorkspace={setWorkspaces}
            />
          </div>
          {workspaces.map((workspace, index) => (
            <div
              key={index}
              className="text-white text-sm rounded-md font-normal hover:bg-teal-500 focus:outline-none focus:bg-teal-700"
            >
              <button
                className="w-full select-none py-2 px-3"
                onClick={() => clickRedirecionar(workspace.id, workspace.nome)}
              >
                {workspace.nome}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BotaoWorkspaces;
