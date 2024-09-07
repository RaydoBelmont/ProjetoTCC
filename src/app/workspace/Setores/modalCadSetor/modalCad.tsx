import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  CardFooter,
} from "../../../lib/material-tailwindcss/material-tailwindcss";
import { inserirSetor } from "@/app/lib/SetoresFunctions/libInserirSetor";
import { editarSetor } from "@/app/lib/SetoresFunctions/libEditarSetor";

type propsCadSetor = {
  isOpen: boolean;
  setModalOpen: () => void;
  idWorkspace: number;
  atualizarSetores: (idWorkspace: number) => void;
  tipoModal: string;
  setorId?: number;
};

export default function ModalCadSetor(props: propsCadSetor) {
  const [nomeCriar, setNomeCriar] = useState<string>("");
  const [nomeEditar, setNomeEditar] = useState<string>("");

  const acaoBotaoCancelar = () => {
    if (props.tipoModal === "INSERIR") {
      setNomeCriar("");
    } else if (props.tipoModal === "EDITAR") {
      setNomeEditar("");
    }
    props.setModalOpen();
  };

  const salvarSetor = async (event: React.FormEvent) => {
    event.preventDefault();

    switch (props.tipoModal) {
      case "INSERIR":
        try {
          const novoSetor = await inserirSetor(props.idWorkspace, nomeCriar);
          if (novoSetor) {
            alert("Novo Setor inserido com Sucesso!");
            setNomeCriar("");
            props.atualizarSetores(props.idWorkspace);
            props.setModalOpen();
            break;
          }
        } catch (error) {
          console.log("Erro ao tentar inserir novo Setor.", error);
        }

      case "EDITAR":
        try {
          const setorAtualizado = await editarSetor(props.setorId, nomeEditar);
          if (setorAtualizado) {
            alert("Setor atualizado com Sucesso!");
            setNomeEditar("");
            props.atualizarSetores(props.idWorkspace);
            props.setModalOpen();
            break;
          }
        } catch (error) {
          console.log("Erro ao tentar editar Setor.", error);
        }
    }
  };

  switch (props.tipoModal) {
    case "INSERIR":
      return (
        <Dialog
          size="sm"
          open={props.isOpen}
          handler={props.setModalOpen}
          className="bg-transparent shadow-none "
        >
          <Card className="mx-auto w-full max bg-[#384152]">
            <form onSubmit={salvarSetor}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="white">
                  Cadastro Novo Setor
                </Typography>
                <Input
                  label="Nome"
                  value={nomeCriar}
                  onChange={(e) => setNomeCriar(e.target.value)}
                  required
                  crossOrigin={""}
                  color="white"
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
        </Dialog>
      );

    case "EDITAR":
      return (
        <Dialog
          size="sm"
          open={props.isOpen}
          handler={props.setModalOpen}
          className="bg-transparent shadow-none "
        >
          <Card className="mx-auto w-full max bg-[#384152]">
            <form onSubmit={salvarSetor}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="white">
                  Editar Setor
                </Typography>
                <Input
                  label="Nome"
                  value={nomeEditar}
                  onChange={(e) => setNomeEditar(e.target.value)}
                  required
                  crossOrigin={""}
                  color="white"
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
        </Dialog>
      );

    default:
      return null;
  }
}
