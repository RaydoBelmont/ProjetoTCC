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
import SelectStatus from "@/app/components/selects/selectStatusChamado";
import { listaStatus } from "@/app/lib/StatusFunctions/libListaStatus";
import CryptoJS from "crypto-js";
import { useParams } from "next/navigation";

type propsChamado = {
  isOpen: boolean;
  setModalOpen: () => void;
  idSetor: number;
  idQuadro?: number;
  atualizarChamados?: (idQuadro: number) => void;
  tipoModal: string;
  chamadoId?: number;
};

type Status = {
  id: number;
  nome: string;
};
type Cliente = {
  id: number;
  nome: string;
};

export default function ModalCadChamado(props: propsChamado) {
  const {idSetor } = useParams();
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [idStatus, setIdStatus] = useState<number>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [listaDeStatus, setListaDeStatus] = useState<Status[]>([]);

  // Fetching Clientes from API
  useEffect(() => {
    const fetchData = async () => {
      if (!props.idSetor) {
        const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
        const bytes = CryptoJS.AES.decrypt(
          decodeURIComponent(String(idSetor)),
          secretKey
        );
        const decryptedSetorId = Number(
          JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        );
        const result = await listaStatus(decryptedSetorId);
        setListaDeStatus(result);
      } else {
        const result = await listaStatus(props.idSetor);
        setListaDeStatus(result);
      }
    };
    fetchData();
  }, []);

  const handleClienteChange = (selectedOption: Cliente | null) => {
    setCliente(selectedOption);
  };

  const acaoBotaoCancelar = () => {
    setTitulo("");
    setDescricao("");
    setCliente(null);
    props.setModalOpen();
  };

  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id,
    label: cliente.nome,
  }));

  const AtualizaListaStatus = async () => {
    const result = await listaStatus(props.idSetor);
    setListaDeStatus(result);
  };

  const acaoSalvarChamado = (event: React.FormEvent) => {
    event.preventDefault()
    console.log(idStatus)
  }
  return (
    <Dialog
      size="xl"
      open={props.isOpen}
      handler={props.setModalOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="flex flex-row mx-auto w-full max bg-[#384152]">
        <form onSubmit={acaoSalvarChamado} className="flex-grow">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="white">
              {props.tipoModal === "INSERIR"
                ? "Cadastro de Chamado"
                : "Editar Chamado"}
            </Typography>

            {/* Substituindo react-select pelo CustomSelect */}
            <SelectClientes
              options={clientes}
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
            {/* Select de Status */}
            <SelectStatus
              statusList={listaDeStatus}
              atualizaLista={AtualizaListaStatus}
              setorId={props.idSetor}
              setarIdStatus={setIdStatus}
            />

            {/* Select de Prioridade */}
            <select className="p-2 rounded bg-[#374151] text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Prioridade...</option>
              <option value="1">Baixa</option>
              <option value="2">Média</option>
              <option value="3">Alta</option>
            </select>

            
          </div>
        </div>
      </Card>
    </Dialog>
  );
}
