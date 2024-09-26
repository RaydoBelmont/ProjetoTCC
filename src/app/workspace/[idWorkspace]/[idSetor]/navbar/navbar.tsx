import {
  Button,
  Navbar,
} from "../../../../lib/material-tailwindcss/material-tailwindcss";
import { FaPlus} from "react-icons/fa";

interface Props {
  idWorkspace: number;
  idSetor: number;
  isOpen: boolean;
  setModalOpen: () => void;
  setTipoModal: () => void;
  tipoModal?: string;
}

export default function NavbarSetor(props: Props) {
  const acaoInserir = () => {
    props.setModalOpen();
    props.setTipoModal();
  };

  return (
    <Navbar className="w-full max-w-full rounded-none px-4 py-2 bg-[#202938] border-none">
      <div className="flex gap-2 ">
        <Button
          variant="text"
          size="sm"
          onClick={acaoInserir}
          className="flex items-center gap-1 normal-case text-sm font-normal text-white bg-[#394152]  hover:bg-gray-600 shadow-lg"
        >
          <FaPlus />
          Novo Quadro
        </Button>
      </div>
    </Navbar>
  );
}
