import { Dispatch, SetStateAction, useState } from "react";
import ModalCadWork from "../modals/cadWorkspace/modalCadWork";
import { workspace } from "../navbar";

type Props = {
  areaDeTrabalho: workspace[];
  setWorkspace: Dispatch<SetStateAction<workspace[]>>;
};

const BotaoModalWorkspace: React.FC<Props> = ({
  areaDeTrabalho,
  setWorkspace,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button className="py-2 px-3" onClick={() => setIsModalOpen(true)}>
        + Nova Workspace
      </button>
      <ModalCadWork
        isOpen={isModalOpen}
        setModalOpen={() => setIsModalOpen(!isModalOpen)}
        setWorkspace={setWorkspace}
        areaDeTrabalho={areaDeTrabalho}
      />
    </div>
  );
};

export default BotaoModalWorkspace;
