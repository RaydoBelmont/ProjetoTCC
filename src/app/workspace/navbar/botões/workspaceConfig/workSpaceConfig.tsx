import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GoGear } from "react-icons/go";
import styles from "../navbar.module.css";
import { useClickAway } from "react-use";

export default function WorkspaceConfig() {
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
        onClick={() => setIsOpen(!isOpen)}
        className=" rounded-md shadow-lg px-2 py-2 hover:bg-gray-600 text-sm font-medium text-white focus:outline-none"
      >
        <GoGear />
      </button>
      {isOpen && (
        <motion.div
          className="origin-top-right absolute right-0 mt-2 w-56 p-2 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a href="#" className={styles["btn-item-dropdown"]} role="menuitem">
              Opção 1
            </a>
            <a href="#" className={styles["btn-item-dropdown"]} role="menuitem">
              Opção 2
            </a>
            <a href="#" className={styles["btn-item-dropdown"]} role="menuitem">
              Opção 3
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
