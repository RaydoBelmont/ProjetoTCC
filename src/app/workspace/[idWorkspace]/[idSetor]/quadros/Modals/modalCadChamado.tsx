"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  CardFooter,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { buscarClientes } from "@/app/lib/WorkspaceFunctions/Clientes/buscaClientesDaWorkspace";
import InputTextArea from "@/app/components/inputs/inputText";
import SelectClientes from "@/app/components/selects/SelectClientes";
import { inserirChamado } from "@/app/lib/ChamadosFunctions/libInserirChamado";
import CryptoJS from "crypto-js";
import { useParams } from "next/navigation";
import { listaPrioridades } from "@/app/lib/PrioridadesFunctions/libListaPrioridades";
import SelectPrioridades from "@/app/components/selects/selectPrioridades";
import { buscaIdUserPorEmail } from "../../../../../lib/UserFunctions/buscaIDuser";
import { useSession } from "next-auth/react";


type propsChamado = {
  isOpen: boolean;
  setModalOpen: () => void;
  idSetor: number;
  idWorkspace: number;
  idQuadro: number;
  atualizarChamados?: (idQuadro: number) => void;
  tipoModal: string;
  chamadoId?: number;
};

export type Prioridade = {
  id: number;
  nome: string;
};

export type Cliente = {
  id: number;
  nome: string;
  cpfCnpj: string;
};



export default function ModalCadChamado(props: propsChamado) {
  const { data: session } = useSession();
  const { idWorkspace, idSetor } = useParams();
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [idPrioridade, setIdPrioridade] = useState<number>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [listaDePrioridades, setListaDePrioridades] = useState<Prioridade[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (props.idSetor && props.idWorkspace) {
        try {
          const listaClientes = await buscarClientes(props.idWorkspace);
          setClientes(listaClientes);

          const resultPrioridades = await listaPrioridades(props.idSetor);
          setListaDePrioridades(resultPrioridades);
        } catch (error) {
          console.log("Erro ao tentar buscar dados.");
        }
      } else {
        try {
          // Chave de criptografia (garantindo que ela existe)
          const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

          // Descriptografando os dados vindos da URL (idWorkspace e idSetor)
          const decryptedWorkspaceIdBytes = CryptoJS.AES.decrypt(
            decodeURIComponent(String(idWorkspace)),
            secretKey
          );
          const decryptedSetorIdBytes = CryptoJS.AES.decrypt(
            decodeURIComponent(String(idSetor)),
            secretKey
          );

          // Convertendo os bytes de volta para string
          const decryptedWorkspaceId = decryptedWorkspaceIdBytes.toString(
            CryptoJS.enc.Utf8
          );
          const decryptedSetorId = decryptedSetorIdBytes.toString(
            CryptoJS.enc.Utf8
          );

          // Verifica se a descriptografia funcionou
          if (decryptedWorkspaceId && decryptedSetorId) {
            // Buscar clientes usando o id descriptografado
            const listaClientes = await buscarClientes(
              Number(decryptedWorkspaceId)
            );
            setClientes(listaClientes);

            const resultPrioridades = await listaPrioridades(
              Number(decryptedSetorId)
            );
            setListaDePrioridades(resultPrioridades);
          } else {
            console.error("Erro ao descriptografar os IDs.");
          }
        } catch (error) {
          console.error("Erro ao descriptografar dados:", error);
        }
      }
    };

    fetchData();
  }, [idWorkspace, idSetor]);

  const handleClienteChange = (selectedOption: Cliente | null) => {
    setCliente(selectedOption);
  };

  const acaoBotaoCancelar = () => {
    setTitulo("");
    setDescricao("");
    setIdPrioridade(null);
    setCliente(null);
    props.setModalOpen();
  };

  const clienteOptions = clientes.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    cpfCnpj: cliente.cpfCnpj,
  }));

  const AtualizaListaPrioridades = async () => {
    const result = await listaPrioridades(props.idSetor);
    setListaDePrioridades(result);
  };

  const acaoSalvarChamado = async (event: React.FormEvent) => {
    event.preventDefault();

    const idMembro = await buscaIdUserPorEmail(session.user.email);

    try {
      const chamado = await inserirChamado(
        cliente.id,
        titulo,
        descricao,
        idPrioridade,
        idMembro,
        props.idQuadro,
        props.idWorkspace
      );
      if (chamado) {
        console.log(chamado);
        alert("Chamado inserido com Sucesso!");
        props.atualizarChamados(props.idQuadro);
        acaoBotaoCancelar();
      }
    } catch (error) {
      console.log("Erro ao tentar inserir chamado", error);
    }
  };

  return (
    <Dialog
      size="xl"
      open={props.isOpen}
      handler={props.setModalOpen}
      className="bg-transparent shadow-none"
      dismiss={{ enabled: false }}
    >
      <Card className="flex flex-row mx-auto w-full  bg-[#384152]">
        <form onSubmit={acaoSalvarChamado} className="flex-grow">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="white">
              {props.tipoModal === "INSERIR"
                ? "Cadastro de Chamado"
                : "Editar Chamado"}
            </Typography>

            <SelectClientes
              options={clienteOptions}
              value={cliente}
              onChange={handleClienteChange}
              placeholder="Selecionar cliente..."
            />

            <Input
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              color="white"
              crossOrigin={undefined}
              maxLength={80}
            />
            <InputTextArea
              nome={"Descrição"}
              valor={descricao}
              acao={"INSERIR"}
              setarValor={setDescricao}
              linhas={10}
            />
          </CardBody>
          <CardFooter className="pt-0 flex justify-end space-x-2">
            <Button variant="gradient" color="red" onClick={acaoBotaoCancelar}>
              Cancelar
            </Button>
            <Button type="submit" color="green">
              Salvar
            </Button>
          </CardFooter>
        </form>

        {/* Menu lateral ao lado direito */}
        <div className="bg-[#394152] p-4 rounded-r w-1/4">
          <Typography variant="h4" color="white" className="mb-6 text-center">
            Detalhes
          </Typography>
          <div className="flex flex-col gap-4">
            {/* Select de Prioridade */}
            <SelectPrioridades
              listaPrioridades={listaDePrioridades}
              atualizaLista={AtualizaListaPrioridades}
              setorId={props.idSetor}
              setarIdPrioridade={setIdPrioridade}
            />
          </div>
        </div>
      </Card>
    </Dialog>
  );
}
