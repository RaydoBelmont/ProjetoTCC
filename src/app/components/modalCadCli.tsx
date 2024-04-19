import { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  setModalOpen: () => void;
}

const ModalCadCli: React.FC<ModalProps> = ({ isOpen, setModalOpen }) => {
  const [cliente, setCliente] = useState({
    nome: "",
    razaoSocial: "",
    endereco: "",
    cpfCnpj: "",
    inscricaoEstadual: "",
    telefone: "",
    celular: "",
    email: "",
    observacao: "",
  });

  if (!isOpen) return null;

  const handleChange = (key: string, value: string) => {
    setCliente({ ...cliente, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para salvar o cliente
    console.log("Cliente cadastrado:", cliente);
    setCliente({
      nome: "",
      razaoSocial: "",
      endereco: "",
      cpfCnpj: "",
      inscricaoEstadual: "",
      telefone: "",
      celular: "",
      email: "",
      observacao: "",
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white p-8 rounded-lg animate-fade-in max-w-screen-md w-full mt-auto mb-auto">
        <h1 className=" text-2xl font-semibold mb-4 text-black text-center ">
          Cadastrar Cliente
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <label htmlFor="nome" className="form-text">
                Nome:
              </label>
              <input
                type="text"
                id="nome"
                className="formControl text-black"
                value={cliente.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            </div>
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <label htmlFor="razaoSocial" className="form-text">
                Razão Social:
              </label>
              <input
                type="text"
                id="razaoSocial"
                className="formControl text-black"
                value={cliente.razaoSocial}
                onChange={(e) => handleChange("razaoSocial", e.target.value)}
              />
            </div>
            <div className="w-full lg:w-2/2 px-2 mb-4">
              <label htmlFor="endereco" className="form-text">
                Endereço Completo:
              </label>
              <input
                type="text"
                id="endereco"
                className="formControl text-black"
                value={cliente.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
              />
            </div>
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <label htmlFor="cpfcnpj" className="form-text">
                CPF/CNPJ:
              </label>
              <input
                type="text"
                id="cpfcnpj"
                className="formControl text-black"
                value={cliente.cpfCnpj}
                onChange={(e) => handleChange("cpfCnpj", e.target.value)}
              />
            </div>
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <label htmlFor="telefone" className="form-text">
                Telefone:
              </label>
              <input
                type="text"
                id="telefone"
                className="formControl text-black"
                value={cliente.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
              />
            </div>
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <label htmlFor="celular" className="form-text">
                Celular:
              </label>
              <input
                type="text"
                id="celular"
                className="formControl text-black"
                value={cliente.celular}
                onChange={(e) => handleChange("celular", e.target.value)}
              />
            </div>
            <div className="w-full lg:w-1/2 px-2 mb-4">
              <label htmlFor="email" className="form-text">
                Email:
              </label>
              <input
                type="text"
                id="email"
                className="formControl text-black"
                value={cliente.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="w-full lg:w-2/2 px-2 mb-4">
              <label htmlFor="observacao" className="form-text">
                Observações
              </label>
              <textarea
                id="observacao"
                className="formControl resize-none text-black"
                value={cliente.observacao}
                onChange={(e) => handleChange("observacao", e.target.value)}
                rows={6} // Você pode ajustar a altura desejada definindo o número de linhas
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setModalOpen();
                setCliente({
                  nome: "",
                  razaoSocial: "",
                  endereco: "",
                  cpfCnpj: "",
                  inscricaoEstadual: "",
                  telefone: "",
                  celular: "",
                  email: "",
                  observacao: "",
                });
              }}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCadCli;
