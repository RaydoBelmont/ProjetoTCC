import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SlPeople } from "react-icons/sl";
import styles from "../navbar.module.css";
import { useClickAway } from "react-use";

type propsBotaoMembros = {
    setaPagina: (numeroPagina: number) => void
}

export default function BotaoMembros(props: propsBotaoMembros) {
  const refBtnMenuDropDown = useRef(null);


  return (
    <div className="relative inline-block text-left" ref={refBtnMenuDropDown}>
      <button
        onClick={() => props.setaPagina(1)}
        className="flex gap-2 justify-center w-full rounded-md shadow-lg px-4 py-2 hover:bg-gray-600 text-sm font-medium text-white focus:outline-none"
      >
        <SlPeople className="mt-0.5" /> Membros
      </button>
    </div>
  );
}
