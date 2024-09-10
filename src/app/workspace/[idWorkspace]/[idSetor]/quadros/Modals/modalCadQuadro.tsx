import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  CardFooter,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import {inserirQuadro} from "@/app/lib/QuadrosFunctions/libInserirQuadro"
import {editarQuadro} from "@/app/lib/QuadrosFunctions/libEditarQuadro"

type propsCadQuadro = {
  isOpen: boolean;
  setModalOpen: () => void;
  idSetor?: number;
  atualizarQuadros?: (idSetor: number) => void;
  tipoModal: string;
  quadroId?: number;
};

export default function ModalCadQuadro(props: propsCadQuadro) {
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

  const salvarQuadro = async (event: React.FormEvent) => {
    event.preventDefault()

    switch (props.tipoModal) {
        case "INSERIR":
          try {
            const novoQuadro = await inserirQuadro(props.idSetor, nomeCriar);
            if (novoQuadro) {
              alert("Novo Quadro inserido com Sucesso!");
              setNomeCriar("");
              props.atualizarQuadros(props.idSetor);
              props.setModalOpen();
              break;
            }
          } catch (error) {
            console.log("Erro ao tentar inserir novo Quadro.", error);
          }
  
        case "EDITAR":
          try {
            const quadroAtualizado = await editarQuadro(props.quadroId, nomeEditar);
            if (quadroAtualizado) {
              alert("Quadro atualizado com Sucesso!");
              setNomeEditar("");
              props.atualizarQuadros(props.idSetor);
              props.setModalOpen();
              break;
            }
          } catch (error) {
            console.log("Erro ao tentar editar Quadro.", error);
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
            <form onSubmit={salvarQuadro}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="white">
                  Cadastro Novo Quadro
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
            <form onSubmit={salvarQuadro}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="white">
                  Editar Quadro
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
