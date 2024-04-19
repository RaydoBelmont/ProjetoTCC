import { useState } from "react";
import ModalCadCli from "../modals/modalCadCli";

const BtnModalClientes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Cadastrar Cliente
      </button>
      <ModalCadCli
        isOpen={isModalOpen}
        setModalOpen={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BtnModalClientes