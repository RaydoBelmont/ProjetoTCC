import { useState, useEffect, useRef } from "react";

type Cliente = {
  id: number;
  nome: string;
};

type SelectClienteProps = {
  clientes: Cliente[];
  onSelect: (cliente: Cliente) => void;
  proximoCampoRef: React.RefObject<HTMLInputElement>; // Referência para o próximo campo
};

const SelectCliente: React.FC<SelectClienteProps> = ({
  clientes,
  onSelect,
  proximoCampoRef, // Novo campo para a referência do próximo campo
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>(clientes);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(filtered);
    setHighlightedIndex(0); // Reseta o índice destacado quando a lista é filtrada
  }, [searchTerm, clientes]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (cliente: Cliente) => {
    onSelect(cliente);
    setIsOpen(false);
    setSearchTerm(cliente.nome); // Define o nome do cliente selecionado no campo
    proximoCampoRef.current?.focus(); // Foca no próximo campo após seleção
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault(); // Evita o scroll padrão
        setHighlightedIndex((prevIndex) =>
          prevIndex === filteredClientes.length - 1 ? 0 : prevIndex + 1
        );
        break;
      case "ArrowUp":
        event.preventDefault(); // Evita o scroll padrão
        setHighlightedIndex((prevIndex) =>
          prevIndex === 0 ? filteredClientes.length - 1 : prevIndex - 1
        );
        break;
      case "Enter":
        event.preventDefault(); // Evita a submissão do formulário
        if (filteredClientes[highlightedIndex]) {
          handleSelect(filteredClientes[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full max-w-sm" ref={selectRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        
        onKeyDown={handleKeyDown}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Selecione ou busque um cliente"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
          {filteredClientes.length > 0 ? (
            filteredClientes.map((cliente, index) => (
              <li
                key={cliente.id}
                onClick={() => handleSelect(cliente)}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  index === highlightedIndex ? "bg-gray-200" : ""
                }`}
              >
                {cliente.nome}
              </li>
            ))
          ) : (
            <li className="p-2">Nenhum cliente encontrado</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectCliente;
