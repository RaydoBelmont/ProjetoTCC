import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  CardFooter,
} from "../../../lib/material-tailwindcss/material-tailwindcss";
import { buscaMembrosWorkspace } from "@/app/lib/WorkspaceFunctions/Membros/buscaMembrosDaWorkspace";
import { Membro } from "../../Membros/Tabela/TabelaMembros";
import { buscaSetor } from "@/app/lib/SetoresFunctions/listarSetoresIdWorkspaceIdUser";
import { inserirMembro } from "@/app/lib/SetoresFunctions/libInserirMembro";
import { removerMembro } from "@/app/lib/SetoresFunctions/libRemoverMembro";
import Loading from "../../[idWorkspace]/Loading";

type propsGerenciarMembrosSetor = {
  isOpen: boolean;
  setModalOpen: () => void;
  workspaceId: number;
  idSetor: number;
};

type MembroWorkspace = {
  id: number;
  nome: string;
  email: string;
};

export type MembroSetor = {
  setorId: number;
  userId: number;
  user: {
    id: number;
    nome: string;
    email: string;
  };
};

export default function ModalGerenciarMembrosSetor(
  props: propsGerenciarMembrosSetor
) {
  const [membrosFora, setMembrosFora] = useState<MembroWorkspace[]>([]);
  const [membrosSetor, setMembrosSetor] = useState<MembroSetor[]>([]);

  const getMembrosWorkspace = async () => {
    const response = await buscaMembrosWorkspace(props.workspaceId);
    return response;
  };

  const getDadosSetor = async () => {
    try {
      const dadosSetor = await buscaSetor(props.idSetor);
      return dadosSetor;
    } catch (error) {
      console.log("Erro ao buscar dados do setor: ", error);
    }
  };

  const moverParaSetor = async (idMembro: number) => {
  
      try {
        const result = await inserirMembro(props.idSetor, idMembro);

        if (result) {
          // Encontrar o membro que foi adicionado ao setor
          const membroMovido = membrosFora.find(
            (membro) => membro.id === idMembro
          );

          if (membroMovido) {
            // Atualizar as listas: mover de membrosFora para membrosSetor
            setMembrosSetor([
              ...membrosSetor,
              { setorId: props.idSetor, userId: idMembro, user: membroMovido },
            ]);
            setMembrosFora(
              membrosFora.filter((membro) => membro.id !== idMembro)
            );
          }
        }
      } catch (error) {
        console.log("Erro ao inserir membro no setor", error);
      }
  };

  const removerDoSetor = async (idMembro: number) => {
    if(membrosSetor.length > 1){
      try {
        const result = await removerMembro(props.idSetor, idMembro);
  
        if (result) {
          // Encontrar o membro que foi removido do setor
          const membroRemovido = membrosSetor.find(
            (membro) => membro.userId === idMembro
          );
  
          if (membroRemovido) {
            // Atualizar as listas: mover de membrosSetor para membrosFora
            setMembrosFora([
              ...membrosFora,
              {
                id: membroRemovido.userId,
                nome: membroRemovido.user.nome,
                email: membroRemovido.user.email,
              },
            ]);
            setMembrosSetor(
              membrosSetor.filter((membro) => membro.userId !== idMembro)
            );
          }
        }
      } catch (error) {
        console.log("Erro ao remover membro do setor", error);
      }
    }else{
      alert("Deve existir pelo menos 1 membro no setor")
    }

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membrosWorkspace = await getMembrosWorkspace();
        const dadosSetor = await getDadosSetor();

        if (membrosWorkspace && dadosSetor) {
          // Lista de membros que pertencem ao setor
          setMembrosSetor(dadosSetor.membros);

          // Filtrar membros que não pertencem ao setor
          const membrosSetorIds = dadosSetor.membros.map(
            (membro: MembroSetor) => membro.userId
          );
          const membrosForaDoSetor = membrosWorkspace.filter(
            (membro: Membro) => !membrosSetorIds.includes(membro.id)
          );

          setMembrosFora(membrosForaDoSetor);
        }
      } catch (error) {
        console.log("Erro no useEffect: ", error);
      }
    };

    fetchData();
  }, []);

  if (membrosSetor && membrosFora) {
    return (
      <Dialog
        size="lg"
        open={props.isOpen}
        handler={props.setModalOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max bg-[#384152]">
          <CardBody className="flex flex-row gap-8">
            {/* Coluna de membros fora do setor */}
            <div className="w-1/2">
              <Typography variant="h5" color="white">
                Membros Fora do Setor
              </Typography>
              <div className="space-y-2 mt-4">
                {membrosFora.map((membro) => (
                  <div
                    key={membro.id}
                    className="flex justify-between items-center bg-gray-700 p-2 rounded"
                  >
                    <Typography color="white">
                      {membro.nome} ({membro.email})
                    </Typography>
                    <Button
                      color="green"
                      size="sm"
                      onClick={() => moverParaSetor(membro.id)}
                    >
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Coluna de membros no setor */}
            <div className="w-1/2">
              <Typography variant="h5" color="white">
                Membros no Setor
              </Typography>
              <div className="space-y-2 mt-4">
                {membrosSetor.map((membro) => (
                  <div
                    key={membro.user.id}
                    className="flex justify-between items-center bg-gray-700 p-2 rounded"
                  >
                    <Typography color="white">
                      {membro.user.nome} ({membro.user.email})
                    </Typography>
                    <Button
                      color="red"
                      size="sm"
                      onClick={() => removerDoSetor(membro.userId)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
  
          <CardFooter className="pt-0 flex justify-end space-x-2">
            <Button variant="gradient" color="red" onClick={props.setModalOpen}>
              Fechar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    );
  } else {
    return (
      <Loading />
    )
  }
  
}
