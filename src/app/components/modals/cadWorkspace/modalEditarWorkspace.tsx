import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  CardFooter,
} from "../../../lib/material-tailwindcss/material-tailwindcss";
import { editarWorkspace } from "@/app/lib/WorkspaceFunctions/Workspace/libEditarWorkspace";

type ModalEditarWorkspacekProps = {
  isOpen: boolean;
  setModalOpen: () => void;
  attListaWorkspace: (email: string) => void;
  idWorkspace: number
  setIdWorkspace: () => void
};

const ModalEditarWorkspace: React.FC<ModalEditarWorkspacekProps> = ({
  isOpen,
  setModalOpen,
  attListaWorkspace,
  idWorkspace,
  setIdWorkspace
}) => {
  const { data: session } = useSession();
  const [nome, setNome] = useState<string>("");
  const acaoBotaoCancelar = () => {
    setNome("");
    setIdWorkspace()
    setModalOpen();
  };

  const salvarWorkspace = async (event: React.FormEvent) => {
    event.preventDefault();
    let emailUser = session?.user?.email;
    try {
      const response = await editarWorkspace(nome, idWorkspace);
      if (response) {
        await attListaWorkspace(emailUser);
        alert("Cadastro atualizado com sucesso!");
        setModalOpen();
      } else if (!response) {
        throw new Error("Ocorreu um erro ao atualizar a workspace.");
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <Dialog
      size="sm"
      open={isOpen}
      handler={setModalOpen}
      className="bg-transparent shadow-none "
    >
      <Card className="mx-auto w-full max bg-[#384152]">
        <form onSubmit={salvarWorkspace}>
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="white">
              Editar Workspace
            </Typography>
            <Input
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              crossOrigin={""}
              color="white"
              maxLength={25}
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
      </Card>
    </Dialog>
  );
};

export default ModalEditarWorkspace;
