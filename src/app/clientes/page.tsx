"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import BtnModalClientes  from "../components/botoes_modal/btnModalCadCli";

interface Cliente {
  id: number;
  empresa: string;
  razao: string;
  endereco: string;
  cpfCnpj: string;
  iE: string;
  contato1: string;
  contato2: string;
  email: string;
  observacao: string;
}

export default function CadastroClientes() {
  const [cliente, setCliente] = useState<Cliente>({
    id: 0,
    empresa: "",
    razao: "",
    endereco: "",
    cpfCnpj: "",
    iE: "",
    contato1: "",
    contato2: "",
    email: "",
    observacao: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aqui você pode chamar a API para cadastrar o cliente
    console.log(cliente);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex-grow flex flex-col justify-center">
        <div className="max-w-full w-full mx-auto">
          <BtnModalClientes />
          <dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <input
                  id="empresa"
                  name="empresa"
                  type="text"
                  required
                  className="input-field w-1/2"
                  placeholder="Empresa"
                  value={cliente.empresa}
                  onChange={handleChange}
                />
                <input
                  id="razao"
                  name="razao"
                  type="text"
                  required
                  className="input-field w-1/2"
                  placeholder="Razão"
                  value={cliente.razao}
                  onChange={handleChange}
                />
                <input
                  id="endereco"
                  name="endereco"
                  type="text"
                  required
                  className="input-field w-full"
                  placeholder="Endereço"
                  value={cliente.endereco}
                  onChange={handleChange}
                />
                <input
                  id="cpfCnpj"
                  name="cpfCnpj"
                  type="text"
                  required
                  className="input-field w-1/3"
                  placeholder="CPF/CNPJ"
                  value={cliente.cpfCnpj}
                  onChange={handleChange}
                />
                <input
                  id="iE"
                  name="iE"
                  type="text"
                  required
                  className="input-field w-1/3"
                  placeholder="IE"
                  value={cliente.iE}
                  onChange={handleChange}
                />
                <input
                  id="contato1"
                  name="contato1"
                  type="text"
                  required
                  className="input-field w-1/2"
                  placeholder="Contato 1"
                  value={cliente.contato1}
                  onChange={handleChange}
                />
                <input
                  id="contato2"
                  name="contato2"
                  type="text"
                  required
                  className="input-field w-1/2"
                  placeholder="Contato 2"
                  value={cliente.contato2}
                  onChange={handleChange}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field w-1/2"
                  placeholder="Email"
                  value={cliente.email}
                  onChange={handleChange}
                />
                <input
                  id="observacao"
                  name="observacao"
                  type="text"
                  required
                  className="input-field w-full"
                  placeholder="Observação"
                  value={cliente.observacao}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-6 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cadastrar
                </button>
                <button
                  className="mt-6 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
}
