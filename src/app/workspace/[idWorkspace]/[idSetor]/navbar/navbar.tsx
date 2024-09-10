import { useState } from "react";
import {
  MobileNav,
  Typography,
  Button,
  IconButton,
  Navbar,
} from "../../../../lib/material-tailwindcss/material-tailwindcss";

interface Props {
  idWorkspace: number;
  idSetor: number;
  isOpen: boolean;
  setModalOpen: () => void;
  setTipoModal: () => void
}

export default function NavbarSetor(props: Props) {

  const acaoInserir = () => {
    props.setModalOpen()
    props.setTipoModal()
  }
  
  return (
      <Navbar className="w-full max-w-full rounded-none px-4 py-2 bg-[#202938] border-none" >
        <div>
          <Button variant="text" size="sm" onClick={acaoInserir} className="normal-case text-sm font-normal text-white bg-[#394152]  hover:bg-gray-600 shadow-lg">Novo Quadro</Button>
        </div>


      </Navbar>
  );
}
