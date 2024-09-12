import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  CardFooter,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
// import { inserirChamado, editarChamado } from "@/app/lib/ChamadosFunctions";
import { buscarClientes } from "@/app/lib/WorkspaceFunctions/Clientes/buscaClientesDaWorkspace";
// import { buscarStatus } from "@/app/lib/StatusFunctions";

type propsChamado = {
  isOpen: boolean;
  setModalOpen: () => void;
  idQuadro?: number;
  atualizarChamados?: (idQuadro: number) => void;
  tipoModal: string;
  chamadoId?: number;
};

type Cliente = {
  id: number;
  nome: string;
};

type Status = {
  id: number;
  nome: string;
};

export default function ModalCadChamado(props: propsChamado) {
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [statusList, setStatusList] = useState<Status[]>([]);

  const proximoCampoRef = useRef<HTMLInputElement>(null); // Ref para o próximo campo

  // Fetching Clientes and Status from API
  useEffect(() => {
    const fetchData = async () => {
      const fetchedClientes = await buscarClientes(6);
      // const fetchedStatus = await buscarStatus();
      setClientes(fetchedClientes);
      // setStatusList(fetchedStatus);
    };
    fetchData();
  }, []);

  const handleClienteChange = (selectedOption: any) => {
    setCliente(
      selectedOption
        ? { id: selectedOption.value, nome: selectedOption.label }
        : null
    );
  };

  const acaoBotaoCancelar = () => {
    setTitulo("");
    setDescricao("");
    setCliente(null);
    setStatusId(null);
    props.setModalOpen();
  };

  //   const salvarChamado = async (event: React.FormEvent) => {
  //     event.preventDefault();

  //     const chamadoData = {
  //       titulo,
  //       descricao,
  //       clienteId: cliente ? cliente.id : null,
  //       statusId,
  //       quadroId: props.idQuadro,
  //     };

  //     if (props.tipoModal === "INSERIR") {
  //       try {
  //         const novoChamado = await inserirChamado(chamadoData);
  //         if (novoChamado) {
  //           alert("Novo Chamado inserido com Sucesso!");
  //           props.atualizarChamados?.(props.idQuadro!);
  //           acaoBotaoCancelar();
  //         }
  //       } catch (error) {
  //         console.error("Erro ao inserir Chamado.", error);
  //       }
  //     } else if (props.tipoModal === "EDITAR") {
  //       try {
  //         const chamadoAtualizado = await editarChamado(props.chamadoId!, chamadoData);
  //         if (chamadoAtualizado) {
  //           alert("Chamado atualizado com Sucesso!");
  //           props.atualizarChamados?.(props.idQuadro!);
  //           acaoBotaoCancelar();
  //         }
  //       } catch (error) {
  //         console.error("Erro ao editar Chamado.", error);
  //       }
  //     }
  //   };

  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id,
    label: cliente.nome,
  }));

  return (
    <Dialog
      size="lg"
      open={props.isOpen}
      handler={props.setModalOpen}
      className="bg-transparent shadow-none"
    >
      <div className="flex">
        <Card className="mx-auto w-full max bg-[#384152]">
          <form>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="white">
                {props.tipoModal === "INSERIR"
                  ? "Cadastro de Chamado"
                  : "Editar Chamado"}
              </Typography>
              <Select
                options={clienteOptions}
                value={
                  cliente ? { value: cliente.id, label: cliente.nome } : null
                }
                onChange={handleClienteChange}
                placeholder="Selecionar cliente..."
                isClearable
                isSearchable
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: "#394152", // Cor de fundo fora de foco (cinza claro)
                    color: "white", // Cor do texto
                    borderColor: "#E5E7EB", // Azul quando focado, cinza claro fora de foco
                    borderWidth: state.isFocused ? "1px" : "1px", // Borda mais grossa quando focado
                    boxShadow: "none", // Sombra quando focado
                    "&:hover": {
                      borderColor: "white", // Cor da borda ao passar o mouse
                    },
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "white", // Cor do texto da opção selecionada (cinza escuro)
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: "#374151", // Cor de fundo do menu de opções
                    color: "#374151", // Cor do texto das opções
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#3B82F6" : "#374151", // Cor de fundo ao focar na opção
                    color: "white", // Cor do texto ao focar na opção
                  }),
                }}
              />
              <Input
                label="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                color="white"
                crossOrigin={""}
              />
              <Input
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                color="white"
                crossOrigin={""}
              />
            </CardBody>
            <CardFooter className="pt-0 flex justify-end space-x-2">
              <Button
                variant="gradient"
                color="red"
                onClick={acaoBotaoCancelar}
              >
                Cancelar
              </Button>
              <Button type="submit" color="green">
                Salvar
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Dialog>
  );
}
