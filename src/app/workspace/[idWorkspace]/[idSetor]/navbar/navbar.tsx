import { useState } from "react";
import {
  Button,
  Navbar,
} from "../../../../lib/material-tailwindcss/material-tailwindcss";

interface Props {
  idWorkspace: number;
  idSetor: number;
  isOpen: boolean;
  setModalOpen: () => void;
  setTipoModal: () => void
  tipoModal?: string
}

export default function NavbarSetor(props: Props) {

  const acaoInserir = () => {
    props.setModalOpen()
    props.setTipoModal()
  }

  const acaoInserirStatus = () => {

  }
  const acaoInserirPrioridade = () => {

  }
  
  return (
      <Navbar className="w-full max-w-full rounded-none px-4 py-2 bg-[#202938] border-none" >
        <div className="flex gap-2 ">
          <Button variant="text" size="sm" onClick={acaoInserir} className="normal-case text-sm font-normal text-white bg-[#394152]  hover:bg-gray-600 shadow-lg">Novo Quadro</Button>
          <Button variant="text" size="sm" onClick={acaoInserirStatus} className="normal-case text-sm font-normal text-white bg-[#394152]  hover:bg-gray-600 shadow-lg">+ Status</Button>
          <Button variant="text" size="sm" onClick={acaoInserirPrioridade} className="normal-case text-sm font-normal text-white bg-[#394152]  hover:bg-gray-600 shadow-lg">+ Prioridades</Button>
        </div>


      </Navbar>
  );
}
