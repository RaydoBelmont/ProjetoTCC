import { useState } from 'react';
import ModalCadCli from './modalCadCli';
import ModalCadWork from './modalCadWork';

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
      <ModalCadCli isOpen={isModalOpen} setModalOpen={() => setIsModalOpen(false) } />
    </div>
  );
};



const BotaoModalWorkspace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
      className='py-2 px-3'
        onClick={() => setIsModalOpen(true)}
      >
        + Nova Workspace
      </button>
      <ModalCadWork isOpen={isModalOpen} setModalOpen={() => setIsModalOpen(!isModalOpen)}/>
      </div>
  );
};


export {BtnModalClientes, BotaoModalWorkspace}
