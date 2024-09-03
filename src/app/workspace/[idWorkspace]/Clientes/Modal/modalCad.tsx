import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "../../../../lib/material-tailwindcss/material-tailwindcss";
import { Cliente, Contato } from "../clientes";
import { atualizarCliente } from "../../../../lib/WorkspaceFunctions/Clientes/atualizarCliente";

interface popsCadClientes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  idWorkspace: number;
  adicionarClienteNaLista: (novoCliente: Cliente) => void;
  atualizarClienteNaLista: (clienteAtualizado: Cliente) => void;
  acaoModal: string;
  idCliente?: number;
  dadosCliente?: Cliente;
}

export function NovoCliente(props: popsCadClientes) {
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
  const updateCliente = atualizarCliente;

  // Função para aplicar máscara no CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    value = value.slice(0, 9); // Limita o CEP a 9 caracteres
    setCep(value);
  };

  // Função para aplicar máscara no UF
  const handleUfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    value = value.slice(0, 2);
    setUf(value);
  };

  // Função para aplicar máscara nos contatos
  const formatarContato = (contato: string) => {
    const digitsOnly = contato.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

    if (digitsOnly[2] === "9") {
      return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
      return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
  };

  const getMaxLength = (contato: string) => {
    const digitsOnly = contato.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    return digitsOnly.length > 10 ? 15 : 14;
  };

  const handleContatoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    contatoIndex: number
  ) => {
    const { value } = e.target;
    if (contatoIndex === 1) {
      setContato1(formatarContato(value));
    } else {
      setContato2(formatarContato(value));
    }
  };

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
    props.setIsOpen(false);
  };

  const salvarCliente = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity()) {
      const contatos = [];
      if (contato1) contatos.push({ telefone: contato1.replace(/\D/g, "") });
      if (contato2) contatos.push({ telefone: contato2.replace(/\D/g, "") });

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
    } else {
      console.log("Formulário inválido");
    }
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
        setContato1(
          formatarContato(props.dadosCliente.contatos[0]?.telefone || "")
        );
        if (props.dadosCliente.contatos.length > 1) {
          setContato2(
            formatarContato(props.dadosCliente.contatos[1]?.telefone || "")
          );
        }
      }
    }
  }, [props.acaoModal, props.dadosCliente]);

  return (
    <>
      <Dialog
        size="lg"
        open={props.isOpen}
        handler={props.setIsOpen}
        className="bg-transparent shadow-none "
      >
        <Card className="mx-auto w-full max bg-[#384152]">
          <form onSubmit={salvarCliente}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="white">
                Cadastro Novo Cliente
              </Typography>
              <p className="border-t border-white" />
              <Typography
                className="mb-3 font-normal text-gray-100"
                variant="paragraph"
              >
                Preencha as informações do novo cliente.
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  {/* Nome */}
                  <Input
                    label="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    crossOrigin={""}
                    color="white"
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                  />
                </div>
                {/* Razão Social */}
                <div>
                  <Input
                    label="Razão Social"
                    value={razao}
                    onChange={(e) => setRazao(e.target.value)}
                    crossOrigin={""}
                    color="white"
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                  />
                </div>

                {/* CPF/CNPJ */}
                <Input
                  label="CPF/CNPJ"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  required
                  crossOrigin={""}
                  color="white"
                  readOnly={props.acaoModal === "Vizualizar" ? true : false}
                />

                {/* Inscrição Estadual */}

                <Input
                  label="Inscrição Estadual"
                  value={inscricao}
                  onChange={(e) => setInscricao(e.target.value)}
                  crossOrigin={""}
                  color="white"
                  readOnly={props.acaoModal === "Vizualizar" ? true : false}
                />

                {/* Rua */}
                <Input
                  label="Rua"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  crossOrigin={""}
                  color="white"
                  readOnly={props.acaoModal === "Vizualizar" ? true : false}
                />
                {/* Número e CEP */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="CEP"
                    label="Número"
                    value={endNumero}
                    onChange={(e) => setEndNumero(e.target.value)}
                    crossOrigin={""}
                    color="white"
                    containerProps={{ className: "md:min-w-[100px]" }}
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                  />

                  <Input
                    label="CEP"
                    value={cep}
                    onChange={handleCepChange}
                    crossOrigin={""}
                    color="white"
                    containerProps={{ className: "md:min-w-[100px]" }}
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                  />
                </div>
                {/* Cidade */}
                <Input
                  label="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  crossOrigin={""}
                  color="white"
                  readOnly={props.acaoModal === "Vizualizar" ? true : false}
                />
                {/* Bairro e UF */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    crossOrigin={""}
                    color="white"
                    containerProps={{ className: "md:min-w-[100px]" }}
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                  />

                  <Input
                    label="UF"
                    value={uf}
                    onChange={handleUfChange}
                    crossOrigin={""}
                    color="white"
                    containerProps={{ className: "md:min-w-[100px]" }}
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                  />
                </div>
                {/* Email */}
                <Input
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  crossOrigin={""}
                  color="white"
                  readOnly={props.acaoModal === "Vizualizar" ? true : false}
                />
                {/* Contato 1 e Contato 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Contato 1"
                    value={contato1}
                    onChange={(e) => handleContatoChange(e, 1)}
                    crossOrigin={""}
                    color="white"
                    placeholder="(99) 99999-9999"
                    containerProps={{ className: "md:min-w-[100px]" }}
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                    maxLength={getMaxLength(contato1)} // Define o maxLength com base no tipo de número
                  />

                  <Input
                    label="Contato 2"
                    value={contato2}
                    onChange={(e) => handleContatoChange(e, 2)}
                    crossOrigin={""}
                    color="white"
                    placeholder="(99) 99999-9999"
                    containerProps={{ className: "md:min-w-[100px]" }}
                    readOnly={props.acaoModal === "Vizualizar" ? true : false}
                    maxLength={getMaxLength(contato2)} // Define o maxLength com base no tipo de número
                  />
                </div>
                {/* Observações */}
                <div className="col-span-2">
                  <div className="relative w-full">
                    <textarea
                      className="peer h-20 w-full rounded-[7px] border bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-white outline-none transition-all placeholder-shown:border placeholder-shown:border-white focus:border-2 focus:outline-none resize-none" // Mantendo resize-none
                      placeholder=" "
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      readOnly={props.acaoModal === "Vizualizar" ? true : false}
                    />
                    <label
                      className={`absolute transition-all left-3 mt-2 origin-[0] px-1 text-white leading-tight text-[14px]
    ${
      observacao
        ? "-top-4 left-3 scale-[0.85] bg-[#384152] text-white text-[14px]"
        : "peer-placeholder-shown:top-0 peer-placeholder-shown:left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent"
    } 
    peer-focus:-top-4 peer-focus:left-3 peer-focus:scale-[0.85] peer-focus:bg-[#384152] peer-focus:text-white peer-focus:text-[14px]`}
                    >
                      Observações
                    </label>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-0 flex justify-end space-x-2">
              {props.acaoModal === "Vizualizar" ? (
                <Button
                  variant="gradient"
                  color="red"
                  onClick={limpaCamposFechaJanela}
                >
                  Voltar
                </Button>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="gradient"
                    color="red"
                    onClick={limpaCamposFechaJanela}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" color="green">
                    Salvar
                  </Button>
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  );
}
