import React, { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type Option = {
  id: number;
  nome: string;
  cpfCnpj: string;
};

type CustomSelectProps = {
  options: Option[];
  placeholder?: string;
  value?: Option | null;
  onChange: (value: Option | null) => void;
  isDisabled?: boolean;
};

const SelectClientes: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Select...",
  value,
  onChange,
  isDisabled = false, // Adiciona a prop isDisabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState<string | number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  const handleChange = (selectedOption: Option | null) => {
      onChange(selectedOption);
      setIsOpen(false);
      setMaxHeight(0); // Reseta a altura quando uma opção é selecionada
  };

  const handleClear = () => {
      onChange(null);

  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setMaxHeight(0); // Reseta a altura ao clicar fora
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen((prev) => !prev);
      setMaxHeight((prev) => (prev === 0 ? "300px" : 0)); // Altera a altura máxima ao abrir/fechar
      setSearchTerm(""); // Limpa a pesquisa ao abrir
    }
  };

  // Filtra as opções com base no termo de pesquisa
  const filteredOptions = options.filter(
    (option) =>
      option.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.cpfCnpj.includes(searchTerm)
  );

  return (
    <div className="relative w-full" ref={selectRef}>
      <div
        onClick={toggleDropdown}
        className={`flex justify-between items-center select-none px-4 py-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none bg-[#394152] text-white  ${
          isDisabled
            ? "cursor-not-allowed pointer-events-none"
            : "cursor-pointer"
        }`}
      >
        <span>{value ? `${value.nome} - ${value.cpfCnpj}` : placeholder}</span>
        {isOpen && !isDisabled ? (
          <FaChevronUp className="text-white" />
        ) : (
          <FaChevronDown className={`${isDisabled ? "text-gray-500" : "text-white"}`} />
        )}
      </div>
      {isOpen && !isDisabled && (
        <div
          className={`absolute flex flex-col z-10 w-full mt-1 bg-gray-200 rounded-md shadow-lg transition-all duration-200 overflow-y-auto select-none`}
          style={{ maxHeight }}
        >
          {/* Barra de pesquisa */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar..."
            className="w-full mt-2 focus:outline-none bg-gray-400 text-black placeholder-gray-600"
          />
          {/* Lista de opções filtradas */}
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleChange(option)}
              className="cursor-pointer text-black px-4 py-1 mb-2 hover:bg-gray-300"
            >
              {option.nome} - {option.cpfCnpj}
            </div>
          ))}
        </div>
      )}
      {value && (
        <button
          onClick={handleClear}
          disabled={isDisabled} // Desativa o botão de limpar se estiver desativado
          className={`absolute right-12 top-[21px] transform -translate-y-1/2 text-gray-500 focus:outline-none text-lg ${
            isDisabled ? "cursor-not-allowed text-gray-400" : "hover:text-gray-300"
          }`}
        >
          <IoMdClose />
        </button>
      )}
    </div>
  );
};

export default SelectClientes;
