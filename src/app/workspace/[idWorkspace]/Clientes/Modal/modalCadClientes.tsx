import React, { useEffect, useState } from "react";
import modalCli from "./modalCli.module.css";
import { Cliente, Contato } from "../clientes";
import { atualizarCliente } from "../../../../lib/WorkspaceFunctions/Clientes/atualizarCliente";

interface popsCadClientes {
  setModalOpen: () => void;
  idWorkspace: number;
  adicionarClienteNaLista: (novoCliente: Cliente) => void;
  atualizarClienteNaLista: (clienteAtualizado: Cliente) => void;
  acaoModal: string;
  idCliente?: number;
  dadosCliente?: Cliente;
}

export default function ModalCadClientes(props: popsCadClientes) {
  const [nome, setNome] = useState("");
  const [razao, setRazao] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [rua, setRua] = useState("");
  const [endNumero, setEndNumero] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [inscricao, setInscricao] = useState("");
  const [email, setEmail] = useState("");
  const [observacao, setObservacao] = useState("");
  const [contato1, setContato1] = useState("");
  const [contato2, setContato2] = useState("");

  const limpaCamposFechaJanela = () => {
    setNome("");
    setRazao("");
    setEmail("");
    setCpfCnpj("");
    setRua("");
    setEndNumero("");
    setCep("");
    setBairro("");
    setCidade("");
    setUf("");
    setInscricao("");
    setObservacao("");
    setContato1("");
    setContato2("");
    props.setModalOpen();
  };

  const updateCliente = atualizarCliente;

  const salvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();

    const contatos = [];
    if (contato1) contatos.push({ telefone: contato1 });
    if (contato2) contatos.push({ telefone: contato2 });

    const endereco =
      rua || endNumero || cep || bairro || cidade || uf
        ? { rua, numero: endNumero, cep, bairro, cidade, uf }
        : null;

    try {
      let response;
      switch (props.acaoModal) {
        case "Create":
          response = await fetch("/api/workspace/clientes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              workspaceId: props.idWorkspace,
              nome,
              cpfCnpj,
              razao,
              iE: inscricao,
              email,
              observacao,
              endereco,
              contatos,
            }),
          });
          if (response.ok) {
            const novoCliente: Cliente = await response.json();
            alert("Cadastro realizado com sucesso!");
            props.adicionarClienteNaLista(novoCliente);
          } else {
            throw new Error("Ocorreu um erro ao criar o cliente.");
          }
          break;

        case "Update":
          let contato1Atualizado;
          let contato2Atualizado;

          if (props.dadosCliente?.contatos[0]?.id) {
            contato1Atualizado = {
              id: props.dadosCliente?.contatos[0]?.id,
              telefone: contato1,
            };
          } else {
            contato1Atualizado = { telefone: contato1 };
          }

          if (props.dadosCliente?.contatos[1]?.id) {
            contato2Atualizado = {
              id: props.dadosCliente?.contatos[1]?.id,
              telefone: contato2,
            };
          } else {
            contato2Atualizado = { telefone: contato2 };
          }
          let contatosAtualizados: Contato[] = [
            contato1Atualizado,
            contato2Atualizado,
          ];

          let clienteAtualizado;
          try {
            clienteAtualizado = await updateCliente(
              props.dadosCliente.id,
              nome,
              cpfCnpj,
              razao,
              inscricao,
              email,
              observacao,
              endereco,
              contatosAtualizados
            );
            if (clienteAtualizado) {
              props.atualizarClienteNaLista(clienteAtualizado);
              alert("Cliente atualizado com sucesso!");
            } else {
              throw new Error("Ocorreu um erro ao atualizar o cliente.");
            }
            break;
          } catch (error) {
            throw new Error(error);
          }

        default:
          throw new Error("Ação desconhecida!");
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }

    limpaCamposFechaJanela();
  };

  useEffect(() => {
    if (props.acaoModal === "Update" || props.acaoModal === "Vizualizar") {
      setNome(props.dadosCliente.nome);
      setRazao(props.dadosCliente.razao);
      setEmail(props.dadosCliente.email);
      setCpfCnpj(props.dadosCliente.cpfCnpj);
      setRua(props.dadosCliente.endereco?.rua || "");
      setEndNumero(props.dadosCliente.endereco?.numero || "");
      setCep(props.dadosCliente.endereco?.cep || "");
      setBairro(props.dadosCliente.endereco?.bairro || "");
      setCidade(props.dadosCliente.endereco?.cidade || "");
      setUf(props.dadosCliente.endereco?.uf || "");
      setInscricao(props.dadosCliente.iE);
      setObservacao(props.dadosCliente.observacao);

      if (
        props.dadosCliente.contatos &&
        props.dadosCliente.contatos.length > 0
      ) {
        setContato1(props.dadosCliente.contatos[0]?.telefone || "");
        if (props.dadosCliente.contatos.length > 1) {
          setContato2(props.dadosCliente.contatos[1]?.telefone || "");
        }
      }
    }
  }, [props.acaoModal, props.dadosCliente]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#202938] p-6 rounded-lg w-full max-w-4xl max-h-[98%] overflow-y-auto">
        <h2 className="text-white text-xl mb-2">Novo Cliente</h2>
        <form onSubmit={salvarCliente}>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-2 gap-x-2">
            <div>
              <p className="ml-1">Nome</p>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={modalCli.input}
                required
              />
            </div>
            <div>
              <p className="ml-1">Razão Social</p>
              <input
                type="text"
                placeholder="Razão Social"
                value={razao}
                onChange={(e) => setRazao(e.target.value)}
                className={modalCli.input}
              />
            </div>
            <div>
              <p className="ml-1">CPF/CNPJ</p>
              <input
                type="text"
                placeholder="CPF/CNPJ"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                className={modalCli.input}
                required
              />
            </div>
            <div>
              <p className="ml-1">Inscrição Estadual</p>
              <input
                type="text"
                placeholder="Inscrição Estadual"
                value={inscricao}
                onChange={(e) => setInscricao(e.target.value)}
                className={modalCli.input}
              />
            </div>

            {/* Rua, Número e CEP */}
            <div>
              <p className="ml-1">Rua</p>
              <input
                type="text"
                placeholder="Rua"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                className={modalCli.input}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="col-span-1">
                <p className="ml-1">Número</p>
                <input
                  type="text"
                  placeholder="Número"
                  value={endNumero}
                  onChange={(e) => setEndNumero(e.target.value)}
                  className={modalCli.input}
                />
              </div>
              <div>
                <p className="ml-1">CEP</p>
                <input
                  type="text"
                  placeholder="CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className={modalCli.input}
                />
              </div>
            </div>

            {/* Cidade */}
            <div>
              <p className="ml-1">Cidade</p>
              <input
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className={modalCli.input}
              />
            </div>

            {/* Bairro e UF */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <div className="col-span-2">
                <p className="ml-1">Bairro</p>
                <input
                  type="text"
                  placeholder="Bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className={modalCli.input}
                />
              </div>
              <div>
                <p className="ml-1">UF</p>
                <input
                  type="text"
                  placeholder="UF"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className={modalCli.input}
                />
              </div>
            </div>

            {/* Email e Observações */}
            <div>
              <p className="ml-1">Email</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={modalCli.input}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="col-span-1">
                <p className="ml-1">Contato 1</p>
                <input
                  type="text"
                  placeholder="Contato 1"
                  value={contato1}
                  onChange={(e) => setContato1(e.target.value)}
                  className={modalCli.input}
                />
              </div>
              <div>
                <p className="ml-1">Contato 2</p>
                <input
                  type="text"
                  placeholder="Contato 2"
                  value={contato2}
                  onChange={(e) => setContato2(e.target.value)}
                  className={modalCli.input}
                />
              </div>
            </div>

            <div className="col-span-2">
              <p className="ml-1">Observações</p>
              <textarea
                placeholder="Observações"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className={modalCli.input}
                rows={4}
              />
            </div>
          </div>
          {props.acaoModal === "Vizualizar" ? (
            <div className="flex justify-end space-x-2 mt-2"> 
            <button
                type="button"
                onClick={limpaCamposFechaJanela}
                className="py-2 px-4 bg-neutral-500 text-white rounded hover:bg-neutral-600"
              >
                Voltar
              </button>
            </div>
          ) : (
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={limpaCamposFechaJanela}
                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
