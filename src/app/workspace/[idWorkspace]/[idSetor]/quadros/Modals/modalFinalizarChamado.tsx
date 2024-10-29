import { FormEvent, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Alert,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { finalizarChamado } from "@/app/lib/ChamadosFunctions/libAlterarChamado";
import { inserirHistorico } from "@/app/lib/ChamadosFunctions/Historico/libInserirHistorico";

type propsModalFinalizar = {
  isOpen: boolean;
  setIsOpen: () => void;
  idChamado: number;
  fecharModalChamado: () => void;
  atualizaChamados: () => void;
  idMembro: number
};

export default function ModalFinalizar(props: propsModalFinalizar) {
  const [solucao, setSolucao] = useState<string>();

  const acaoFecharModal = () => {
    props.setIsOpen();
  };

  const acaoBotaoConfirmar = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const chamadoFinalizado = await finalizarChamado(
        props.idChamado,
        solucao
      );
      if (chamadoFinalizado) {
        const historicoFinalizado = await inserirHistorico(props.idChamado, props.idMembro, "FINALIZADO", "finalizou o chamado", null, null)
        if(historicoFinalizado){
          props.atualizaChamados();
          props.fecharModalChamado();
          acaoFecharModal();
        }
      }
    } catch (error) {}
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
            Finalizar chamado
          </Typography>
          <Alert color="green">
            Antes de finalizar o chamado, por favor informe a solução.
          </Alert>
          <form onSubmit={acaoBotaoConfirmar} className="mt-4">
            <span className="text-white ml-1 font-bold">Solução:</span>
            <textarea
              value={solucao ? solucao : ""}
              onChange={(e) => setSolucao(e.target.value)}
              className="bg-[#2C2F35] text-white rounded border-white border p-2 min-h-36 resize-none"
              required
            ></textarea>
            <div className="flex gap-2 mt-4">
              <Button
                variant="filled"
                fullWidth
                className="bg-green-700 hover:bg-green-600"
                type="submit"
              >
                Finalizar
              </Button>
              <Button
                variant="filled"
                fullWidth
                className="bg-red-700 hover:bg-red-600 "
                onClick={acaoFecharModal}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Dialog>
  );
}
