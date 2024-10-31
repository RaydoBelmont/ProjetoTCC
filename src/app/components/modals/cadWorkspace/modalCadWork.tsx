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
import { inserirWorkspace } from "@/app/lib/WorkspaceFunctions/Workspace/libInserirWorkspace";

type ModalCadWorkProps = {
  isOpen: boolean;
  setModalOpen: () => void;
  attListaWorkspace: (email: string) => void;
};

const ModalCadWork: React.FC<ModalCadWorkProps> = ({
  isOpen,
  setModalOpen,
  attListaWorkspace,
}) => {
  const { data: session } = useSession();
  const [nomeCriar, setNomeCriar] = useState<string>("");
  const acaoBotaoCancelar = () => {
    setNomeCriar("");
    setModalOpen();
  };

  const salvarWorkspace = async (event: React.FormEvent) => {
    event.preventDefault();
    let emailUser = session?.user?.email;
    try {
      const response = await inserirWorkspace(emailUser, nomeCriar);
      if (response) {
        await attListaWorkspace(emailUser);
        alert("Cadastro realizado com sucesso!");
        setModalOpen();
      } else if (!response) {
        throw new Error("Ocorreu um erro ao criar a workspace.");
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
              Cadastro Nova Workspace
            </Typography>
            <Input
              label="Nome"
              value={nomeCriar}
              onChange={(e) => setNomeCriar(e.target.value)}
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

export default ModalCadWork;
