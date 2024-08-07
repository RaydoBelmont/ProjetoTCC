import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

type propsBotao = {
  idWorkspace: string;
  idUser: Number;
};

export default function BotaoSetor(props: propsBotao) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button className="flex gap-2 justify-center w-full rounded-md shadow-lg px-4 py-2 hover:bg-gray-600 text-sm font-medium text-white focus:outline-none">
        <IoMdAdd className="mt-0.5" /> Novo Setor
      </button>
    </div>
  );
}
