import { useEffect, useState } from "react";
import { MembroSetor } from "@/app/workspace/Setores/modals/modalMembrosSetor";
import { buscaSetor } from "@/app/lib/SetoresFunctions/listarSetoresIdWorkspaceIdUser";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  CardFooter,
  List,
  ListItem,
} from "../../../../../lib/material-tailwindcss/material-tailwindcss";
import { inserirMembro } from "@/app/lib/ChamadosFunctions/libManipularMembro";

type propsModalAdicionarMembro = {
  isOpen: boolean;
  setarIsOpen: () => void;
  setorId: number;
  membrosChamado: { user: { id: number; nome: string } }[];
  atualizaMembrosChamados: () => void;
  chamadoId: number;
};

export default function ModalAdicionarMembro(props: propsModalAdicionarMembro) {
  const [membrosParaAdd, setMembrosParaAdd] = useState<MembroSetor[]>([]);

  const acaoAdicionarMembro = async (idUser: number) => {
    try {   
      const membroAdicionado = await inserirMembro(
        props.chamadoId,
        idUser
      );
      if (membroAdicionado) {
        console.log("Passei");
        
        // Atualize os membros do chamado
        props.atualizaMembrosChamados();
        
        // Atualize a lista de membros disponíveis para adicionar
        buscarMembrosDoSetor();
      }
    } catch (error) {
      console.error("Erro ao adicionar membro ao chamado:", error);
    }
  };
  

  const buscarMembrosDoSetor = async () => {
    try {
      const dadosSetor = await buscaSetor(props.setorId);
      const membrosChamadoIds = props.membrosChamado.map(
        (membro) => membro.user.id
      );
      const membrosFiltrados = dadosSetor.membros.filter(
        (membro) => !membrosChamadoIds.includes(membro.userId)
      );
      setMembrosParaAdd(membrosFiltrados);
    } catch (error) {
      console.error("Erro ao buscar membros do setor:", error);
    }
  };

  useEffect(() => {
    if (props.isOpen) {
      buscarMembrosDoSetor();
    }
  }, [props.isOpen, props.membrosChamado]);

  return (
    <Dialog
      size="lg"
      open={props.isOpen}
      handler={props.setarIsOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max bg-[#384152] rounded-lg shadow-lg">
        <CardBody>
          <Typography variant="h5" color="white" className="text-center mb-4">
            Membros Fora do Quadro
          </Typography>
          <Typography color="white" className="mb-2">
            Adicione membros que não estão nesse chamado:
          </Typography>
          <List className="max-h-60 overflow-y-auto">
            {membrosParaAdd.length > 0 ? (
              membrosParaAdd.map((membro) => (
                <ListItem
                  key={membro.userId}
                  className="bg-[#455a64] rounded-md p-2 mb-2 flex justify-between"
                >
                  <Typography color="white">
                    {membro.user.nome} ({membro.user.email})
                  </Typography>
                  <Button
                    size="sm"
                    color="light-blue"
                    onClick={() => {
                      // Lógica para adicionar membro
                      acaoAdicionarMembro(membro.userId);
                    }}
                  >
                    Adicionar
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography color="white" className="text-center">
                Nenhum membro disponível para adicionar.
              </Typography>
            )}
          </List>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button color="gray" onClick={props.setarIsOpen} className="mt-2">
            Fechar
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
