import ModalCadSetor from "@/app/workspace/Setores/modalCadSetor/modalCadSetor";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { TfiViewList } from "react-icons/tfi";

type propsBotao = {
  idWorkspace: string | Number | null;
  userId: number;
  isAdmin: boolean;
  usoTela?: boolean;
  setaPagina?: (numeroPagina: number) => void;
};

export default function BotaoSetor(props: propsBotao) {
  // const [isOpen, setIsOpen] = useState(false);

  // if (props.usoTela) {
  //   if (props.isAdmin === true) {
  //     return (
  //       <div>
  //         <button
  //           className="flex justify-center bg-[#202938] p-4 rounded-lg shadow-md text-teal-300 text-xl font-semibold w-full items-center text-center"
  //           onClick={() => setIsOpen(true)}
  //         >
  //           <IoMdAdd className="mt-0.5 mr-4" /> Novo Setor
  //         </button>
  //         <ModalCadSetor
  //           idWorkspace={props.idWorkspace}
  //           isOpen={isOpen}
  //           setModalOpen={() => setIsOpen(!isOpen)}
  //           userId={props.userId}
  //         />
  //       </div>
  //     );
  //   }
  // } else
    return (
      <div className="relative inline-block text-left">
        <button
          className="flex gap-2 justify-center w-full rounded-md shadow-lg px-4 py-2 hover:bg-gray-600 text-sm font-medium text-white focus:outline-none"
          onClick={() => props.setaPagina(0)}
        >
          <TfiViewList className="mt-0.5" /> Setores
        </button>
      </div>
    );
}
