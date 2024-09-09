import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { buscarClientes } from "../../../lib/WorkspaceFunctions/Clientes/buscaClientesDaWorkspace";
import { libDesativarCliente } from "../../../lib/WorkspaceFunctions/Clientes/desativarCliente";
import { libAtivarCliente } from "../../../lib/WorkspaceFunctions/Clientes/ativarCliente";
import { BotaoDialogo } from "../Clientes/Botões/botaoDialogo";
import { BotaoCheckBoxClientes } from "../Clientes/Botões/botaoCheckStatusCliente";
import { NovoCliente } from "../Clientes/Modal/modalCad";
import { IoEyeOutline } from "react-icons/io5";
import { Button } from "../../../lib/material-tailwindcss/material-tailwindcss";

type propsClientes = {
  idWorkspace: number;
};

export interface Contato {
  id?: number;
  telefone: string;
}

export interface Endereco {
  id: number;
  rua?: string | null;
  numero?: string | null;
  cep?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
}

export interface Cliente {
  id: number;
  nome: string;
  cpfCnpj: string;
  razao?: string | null;
  iE?: string | null;
  email?: string | null;
  observacao?: string | null;
  ativo?: boolean | null;
  endereco?: Endereco;
  contatos?: Contato[];
}

export default function Clientes(props: propsClientes) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [acaoModal, setAcaoModal] = useState<string>();
  const [dadosClienteParaAtualizar, setDadosClienteParaAtualizar] =
    useState<Cliente>();
  const [dadosClienteParaVizualizar, setDadosClienteParaVizualizar] =
    useState<Cliente>();
  const [termoBusca, setTermoBusca] = useState("");
  const [filtrarPor, setFiltrarPor] = useState("nome"); // Filtro inicial: nome
  const [mostrarDesativados, setMostrarDesativados] = useState(false); // Estado para mostrar clientes desativados

  const adicionarClienteNaLista = (novoCliente: Cliente) => {
    setClientes([...clientes, novoCliente]);
  };

  const atualizarClienteNaLista = (clienteAtualizado: Cliente) => {
    setClientes((clientes) =>
      clientes.map((cliente) =>
        cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente
      )
    );
  };

  const acaoNovoCliente = () => {
    setAcaoModal("Create");
    setIsOpen(true);
  };

  const acaoAtualizarCliente = (dadosCliente: Cliente) => {
    setDadosClienteParaAtualizar(dadosCliente);
    setAcaoModal("Update");
    setIsOpen(true);
  };

  const acaoVizualizarCliente = (dadosCliente: Cliente) => {
    setDadosClienteParaVizualizar(dadosCliente);
    setAcaoModal("Vizualizar");
    setIsOpen(true);
  };

  const listarClientes = buscarClientes;
  const desativaCliente = libDesativarCliente;
  const ativaCliente = libAtivarCliente;

  // Função para normalizar o CPF/CNPJ
  const normalizeCpfCnpj = (value: string) => {
    return value.replace(/[.\-/]/g, ""); // Remove pontos, traços e barras
  };

  // Função para filtrar clientes com base na query e no filtro selecionado
  const clientesFiltrados = clientes.filter((cliente) => {
    let valorCampo = cliente[filtrarPor]?.toString().toLowerCase() || "";
    let termoBuscaNormalizado = termoBusca.toLowerCase();

    if (filtrarPor === "cpfCnpj") {
      valorCampo = normalizeCpfCnpj(valorCampo);
      termoBuscaNormalizado = normalizeCpfCnpj(termoBuscaNormalizado);
    }

    // Filtrar por ativo/desativado
    if (mostrarDesativados) {
      return !cliente.ativo && valorCampo.includes(termoBuscaNormalizado);
    } else {
      return cliente.ativo && valorCampo.includes(termoBuscaNormalizado);
    }
  });

  const buscaEsetaClientes = useCallback(async () => {
    const clientes = await listarClientes(props.idWorkspace);
    setClientes(clientes);
  }, [props.idWorkspace, listarClientes]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let query = e.target.value;
    if (filtrarPor === "cpfCnpj") {
      query = normalizeCpfCnpj(query);
    }
    setTermoBusca(query);
  };

  const acaoDesativarCliente = async (id: number) => {
    await desativaCliente(id);
    await buscaEsetaClientes();
  };

  const acaoAtivarCliente = async (id: number) => {
    await ativaCliente(id);
    await buscaEsetaClientes();
  };

  const setaAtivoDesativo = () => {
    setMostrarDesativados(!mostrarDesativados);
  };

  useEffect(() => {
    buscaEsetaClientes();
  }, [props.idWorkspace, buscaEsetaClientes]);

  return (
    <div className="min-h-screen bg-[#111828] p-6">
      <div className="container mx-auto">
        {/* Título e Botão de Adicionar Cliente */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-3xl font-semibold">
            Lista de Clientes
          </h1>
          <Button
            onClick={() => acaoNovoCliente()}
            variant="gradient"
            color="green"
          >
            Novo Cliente
          </Button>

          {isOpen &&
            (() => {
              switch (acaoModal) {
                case "Create":
                  return (
                    <NovoCliente
                      isOpen={isOpen}
                      setIsOpen={() => setIsOpen(!isOpen)}
                      idWorkspace={props.idWorkspace}
                      adicionarClienteNaLista={adicionarClienteNaLista}
                      atualizarClienteNaLista={atualizarClienteNaLista}
                      acaoModal={acaoModal}
                    />
                  );

                case "Update":
                  return (
                    <NovoCliente
                      isOpen={isOpen}
                      setIsOpen={() => setIsOpen(!isOpen)}
                      idWorkspace={props.idWorkspace}
                      adicionarClienteNaLista={adicionarClienteNaLista}
                      atualizarClienteNaLista={atualizarClienteNaLista}
                      acaoModal={acaoModal}
                      dadosCliente={dadosClienteParaAtualizar}
                    />
                  );

                case "Vizualizar":
                  return (
                    <NovoCliente
                      isOpen={isOpen}
                      setIsOpen={() => setIsOpen(!isOpen)}
                      idWorkspace={props.idWorkspace}
                      adicionarClienteNaLista={adicionarClienteNaLista}
                      atualizarClienteNaLista={atualizarClienteNaLista}
                      acaoModal={acaoModal}
                      dadosCliente={dadosClienteParaVizualizar}
                    />
                  );
                default:
                  return null; // Caso nenhuma ação seja identificada, não renderiza nada
              }
            })()}
        </div>

        {/* Barra de Pesquisa e Filtro */}
        <div className="flex justify-between items-center mb-4 space-x-2">
          {/* Filtro Dropdown */}
          <select
            value={filtrarPor}
            onChange={(e) => setFiltrarPor(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded-md w-52"
          >
            <option value="nome">Nome</option>
            <option value="email">Email</option>
            <option value="cpfCnpj">CPF/CNPJ</option>
            <option value="ie">Inscrição Estadual</option>
            <option value="cidade">Cidade</option>
          </select>

          {/* Barra de Pesquisa */}
          <input
            type="text"
            value={termoBusca}
            onChange={handleSearchQueryChange}
            placeholder={`Buscar por ${filtrarPor}`}
            className="bg-gray-700 text-white p-2 rounded-md flex-grow"
          />

          {/* Botão para mostrar clientes desativados */}
          <BotaoCheckBoxClientes setaAtivoDesativo={setaAtivoDesativo} />
          {/* <button
            onClick={setaAtivoDesativo}
            className={`px-4 py-2 rounded ${
              mostrarDesativados ? "bg-yellow-500" : "bg-gray-500"
            } text-white hover:bg-yellow-600 transition`}
          >
            {mostrarDesativados ? "Mostrar Ativos" : "Mostrar Desativados"}
          </button> */}
        </div>

        {/* Tabela de Clientes */}
        <div className="shadow-md rounded-lg overflow-x-auto">
          <table className="w-full bg-[#202938] ">
            <thead>
              <tr>
                <th className="text-left text-white px-4 py-2">Nome</th>
                <th className="text-left text-white px-4 py-2">CPF/CNPJ</th>
                <th className="text-left text-white px-4 py-2">Cidade</th>
                <th className="text-left text-white px-4 py-2">UF</th>
                <th className="text-left text-white px-4 py-2">Email</th>
                <th className="text-left text-white px-4 py-2">Contato 1</th>
                <th className="text-left text-white px-4 py-2">Ações</th>
              </tr>
              <tr>
                <td colSpan={7}>
                  <hr className="border-t border-gray-600 mx-1 mb-2" />
                </td>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.map((cliente) => (
                <React.Fragment key={cliente.id}>
                  <tr className="transition hover:bg-gray-700 rounded-lg">
                    <td className="text-white px-4 py-1">{cliente.nome}</td>
                    <td className="text-white px-4 py-1">
                      {cliente.cpfCnpj ? cliente.cpfCnpj : "N/A"}
                    </td>
                    <td className="text-white px-4 py-1">
                      {cliente.endereco?.cidade
                        ? cliente.endereco?.cidade
                        : "N/A"}
                    </td>
                    <td className="text-white px-4 py-1">
                      {cliente.endereco?.uf ? cliente.endereco?.uf : "N/A"}
                    </td>
                    <td className="text-white px-4 py-1">
                      {cliente.email ? cliente.email : "N/A"}
                    </td>
                    <td className="text-white px-4 py-1">
                      {cliente.contatos[0]?.telefone || "N/A"}
                    </td>
                    <td className="text-white px-4 py-1 flex items-center justify-end gap-2">
                      <button
                        className="bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-600 transition"
                        onClick={() => acaoVizualizarCliente(cliente)}
                      >
                        <IoEyeOutline className="h-6 w-6" />
                      </button>

                      {cliente.ativo ? (
                        <button
                          onClick={() => acaoAtualizarCliente(cliente)}
                          className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition"
                        >
                          Editar
                        </button>
                      ) : null}

                      {cliente.ativo ? (
                        <BotaoDialogo
                          acaoConfirmar={acaoDesativarCliente}
                          idCliente={cliente.id}
                          acao="Desativar"
                        />
                      ) : (
                        <BotaoDialogo
                          acaoConfirmar={acaoAtivarCliente}
                          idCliente={cliente.id}
                          acao="Ativar"
                        />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="pt-1">
                      <hr className="border-t border-gray-600 mx-1 mb-2" />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
