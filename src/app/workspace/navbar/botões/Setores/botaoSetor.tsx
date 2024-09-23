import React from "react";
import { TfiViewList } from "react-icons/tfi";

type propsBotao = {
  setaPagina: (numeroPagina: number) => void;
};

export default function BotaoSetor(props: propsBotao) {
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
