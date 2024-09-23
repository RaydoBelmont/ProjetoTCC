import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";


type Option = {
  id: number;
  nome: string;
};

type CustomSelectProps = {
  options: Option[];
  placeholder?: string;
  value?: Option | null;
  onChange: (value: Option | null) => void;
};

const SelectClientes: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Select...",
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find((option) => option.id === Number(selectedValue)) || null;
    onChange(selectedOption);
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="relative w-full">
      <select
        value={value ? value.id : ""}
        onChange={handleChange}
        className="block w-full bg-[#394152] text-white px-4 py-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nome}
          </option>
        ))}
      </select>
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-7 top-[18px] transform -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none text-lg"
        >
          <IoMdClose />

        </button>
      )}
    </div>
  );
};

export default SelectClientes;
