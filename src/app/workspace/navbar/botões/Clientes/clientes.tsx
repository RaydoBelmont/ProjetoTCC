import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SlPeople } from "react-icons/sl";
import styles from "../navbar.module.css";
import { useClickAway } from "react-use";

type PropsBotaoClientes = {
  setaPagina: (numeroPagina: number) => void
}

export default function BotaoClientes(props: PropsBotaoClientes) {
  const [isOpen, setIsOpen] = useState(false);
  const refBtnMenuDropDown = useRef(null);
  useClickAway(refBtnMenuDropDown, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <div className="relative inline-block text-left" ref={refBtnMenuDropDown}>
      <button
        onClick={() => props.setaPagina(2)}
        className="flex gap-2 justify-center w-full rounded-md shadow-lg px-4 py-2 hover:bg-gray-600 text-sm font-medium text-white focus:outline-none"
      >
        <SlPeople className="mt-0.5" /> Clientes
      </button>
    </div>
  );
}
