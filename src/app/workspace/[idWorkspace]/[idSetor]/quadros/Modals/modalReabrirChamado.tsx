import { FormEvent, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Alert,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { reabrirChamado } from "@/app/lib/ChamadosFunctions/libAlterarChamado";
import { inserirHistorico } from "@/app/lib/ChamadosFunctions/Historico/libInserirHistorico";

type propsModalReabrir = {
  isOpen: boolean;
  setIsOpen: () => void;
  idChamado: number;
  fecharModalChamado: () => void;
  atualizaChamados: () => void;
  idMembro: number;
};

export default function ModalReabrir(props: propsModalReabrir) {
  const acaoFecharModal = () => {
    props.setIsOpen();
  };

  const acaoBotaoConfirmar = async () => {
    try {
      const chamadoReaberto = await reabrirChamado(props.idChamado, true);
      if (chamadoReaberto) {
        const historicoReaberto = await inserirHistorico(
          props.idChamado,
          props.idMembro,
          "REABERTO",
          "reabriu o chamado",
          null,
          null
        );
        if (historicoReaberto) {
          props.atualizaChamados();
          props.fecharModalChamado();
          acaoFecharModal();
        }
      }
    } catch (error) {
      console.log("Erro ao tentar reabrir chamado:" + error.message);
    }
  };

  return (
    <Dialog
      size="sm"
      open={props.isOpen}
      handler={props.setIsOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max bg-[#384152] rounded-lg shadow-lg">
        <CardBody>
          <Typography variant="h5" color="white" className="text-center mb-4">
            Reativar Chamado
          </Typography>
          <Alert color="red">Deseja realmente reativar o chamado?</Alert>
          <div className="flex gap-2 mt-4">
            <Button
              variant="filled"
              fullWidth
              className="bg-green-700 hover:bg-green-600"
              onClick={acaoBotaoConfirmar}
            >
              Sim
            </Button>
            <Button
              variant="filled"
              fullWidth
              className="bg-red-700 hover:bg-red-600 "
              onClick={acaoFecharModal}
            >
              Não
            </Button>
          </div>
        </CardBody>
      </Card>
    </Dialog>
  );
}
