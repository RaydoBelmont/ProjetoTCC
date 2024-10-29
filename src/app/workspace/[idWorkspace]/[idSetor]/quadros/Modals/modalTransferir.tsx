import { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { Quadro } from "../../page";
import SelectQuadro from "./selectQuadro";
import { transferirChamado } from "@/app/lib/ChamadosFunctions/libAlterarChamado";
import { IoClose } from "react-icons/io5";
import { inserirHistorico } from "@/app/lib/ChamadosFunctions/Historico/libInserirHistorico";

type propsModalTransferir = {
  isOpen: boolean;
  setIsOpen: () => void;
  listaQuadros: Quadro[];
  quadroDoChamado: Quadro;
  idChamado: number;
  fecharModalChamado: () => void;
  atualizaChamados: () => void;
  idMembro: number
};

export default function ModalTtransferir(props: propsModalTransferir) {
  const [quadroSelecionado, setQuadroSelecionado] = useState<Quadro | null>();

  const acaoFecharModal = () => {
    setQuadroSelecionado(null);
    props.setIsOpen();
  };

  const acaoBotaoTransferir = async () => {
    if (quadroSelecionado === null) {
      alert("É necessário selecionar um Quadro para transferir");
    } else if (quadroSelecionado.id === props.quadroDoChamado.id) {
      acaoFecharModal();
      props.fecharModalChamado();
    } else {
      try {
        const transferido = await transferirChamado(
          props.idChamado,
          quadroSelecionado.id
        );
        if (transferido === true) {
          const historicoTransferido = await inserirHistorico(props.idChamado, props.idMembro, "TRANSFERIDO", "transferiu o chamado de quadro", props.quadroDoChamado.nome, quadroSelecionado.nome)
          if(historicoTransferido){
            acaoFecharModal();
            props.atualizaChamados();
            props.fecharModalChamado();
          }
        } else {
          alert("Ocorreu algum erro ao tentar transferir o chamado!");
          return;
        }
      } catch (error) {
        console.error(error);
        alert("Ocorreu algum erro ao tentar transferir o chamado!");
        return;
      }
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
          <div className="flex flex-row justify-between items-center">
            <Typography variant="h5" color="white" className="text-center mb-4">
              Transferir Chamado de Quadro
            </Typography>
            <div className="text-gray-500 text-2xl mb-4">
              <button onClick={acaoFecharModal}>
                <IoClose />
              </button>
            </div>
          </div>
          <SelectQuadro
            listaDeQuadros={props.listaQuadros}
            setarQuadro={setQuadroSelecionado}
            quadroDoChamado={props.quadroDoChamado}
          />

          <Button
            variant="filled"
            fullWidth
            className="bg-[#3bb166] hover:bg-[#4ade80] mt-4"
            onClick={acaoBotaoTransferir}
          >
            Transferir
          </Button>
        </CardBody>
      </Card>
    </Dialog>
  );
}
