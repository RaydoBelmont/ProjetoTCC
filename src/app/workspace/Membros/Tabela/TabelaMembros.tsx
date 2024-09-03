"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Button,
  CardBody,
  CardFooter,
  Input,
  Dialog,
  Alert,
} from "../../../lib/material-tailwindcss/material-tailwindcss";
import { libSetarAdmin } from "@/app/lib/WorkspaceFunctions/Membros/setaAdmin";
import {
  buscaIdUserPorEmail,
  buscaUsuarioAdmin,
} from "@/app/lib/UserFunctions/buscaIDuser";

export interface Membro {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
  isCriador: boolean;
}

interface MembrosWorkspaceProps {
  membros: Membro[];
  atualizarMembros: () => void;
  idWorkspace: number;
  nomeWorkspace: string;
}

export default function TableMembros(props: MembrosWorkspaceProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [emailConvite, setEmailConvite] = useState<string>();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const enviarConvite = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const usuarioExiste = await buscaIdUserPorEmail(emailConvite);
      if (usuarioExiste) {
        try {
          const usuarioWorkspaceExiste = await buscaUsuarioAdmin(
            emailConvite,
            props.idWorkspace
          );
          if (usuarioWorkspaceExiste.userId) {
            setAlertMessage("Usuário já existe na Workspace");
            setAlertVisible(true);
          } else {
            setAlertMessage("Usuário não existe na Workspace");
            setAlertVisible(true);
          }
        } catch (error) {
          setAlertMessage("Erro ao verificar o usuário na Workspace");
          setAlertVisible(true);
        }

        setAlertMessage("Usuário existe");
        setAlertVisible(true);
        setEmailConvite("");
        setOpen(!open);
      } else {
        setAlertMessage("Usuário não existe no banco de dados!");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage("Erro ao buscar o usuário");
      setAlertVisible(true);
    }
  };

  const setarAdmin = libSetarAdmin;
  const setaEAtualizaMembros = async (
    idMembro: number,
    idWorkspace: number,
    isAdmin: boolean
  ) => {
    try {
      const membroAtualizado = await setarAdmin(idMembro, idWorkspace, isAdmin);
      if (membroAtualizado) props.atualizarMembros();
    } catch (error) {
      console.error("Erro ao atualizar membro:", error);
    }
  };

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 3000); // O alerta some após 3 segundos

      return () => clearTimeout(timer);
    }
  }, [alertVisible]);

  return (
    <div className="px-6 pt-4 ">
      <section className="w-full bg-[#202938] rounded-lg pb-6">
        <div className="flex justify-between p-6">
          <Typography variant="h3" color="white" className="font-bold">
            Membros da {props.nomeWorkspace}
          </Typography>
          <Button color="light-blue" onClick={handleOpen}>
            Convidar
          </Button>
        </div>

        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            {alertVisible && (
              <Alert
                color="red"
                onClose={() => setAlertVisible(false)}
                className="transition duration-500 ease-in-out transform mt-2 w-[90%]"
              >
                {alertMessage}
              </Alert>
            )}
            <form onSubmit={enviarConvite}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="blue-gray">
                  Convidar Membro
                </Typography>
                <Typography
                  className="mb-3 font-normal"
                  variant="paragraph"
                  color="gray"
                >
                  Informe o email do usuário que você deseja convidar para essa
                  Worksapce.
                </Typography>

                <Typography className="-mb-2" variant="h6">
                  Email do Usuário
                </Typography>
                <Input
                  label="Email"
                  value={emailConvite}
                  onChange={(e) => setEmailConvite(e.target.value)}
                  size="lg"
                  crossOrigin={""}
                />
              </CardBody>
              <CardFooter className="pt-0">
                <Button variant="gradient" type="submit" fullWidth>
                  Enviar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Dialog>

        <Card className="h-full overflow-auto border border-gray-300 bg-[#202938] px-6 mx-6 mb-6 pb-6">
          <table className="w-full min-w-max table-auto text-left ">
            <thead>
              <tr>
                <th className="border-b border-gray-300 pb-4 pt-10 ">
                  <Typography
                    variant="small"
                    color="white"
                    className="font-bold leading-none"
                  >
                    Nome
                  </Typography>
                </th>
                <th className="border-b border-gray-300 pb-4 pt-10">
                  <Typography
                    variant="small"
                    color="white"
                    className="font-bold leading-none"
                  >
                    Email
                  </Typography>
                </th>
                <th className="border-b border-gray-300 pb-4 pt-10">
                  <Typography
                    variant="small"
                    color="white"
                    className="font-bold leading-none"
                  >
                    Cargo
                  </Typography>
                </th>
                <th className="border-b border-gray-300 pb-4 pt-10 pl-7">
                  <Typography
                    variant="small"
                    color="white"
                    className="font-bold leading-none"
                  >
                    Ação
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {props.membros.map((membro) => (
                <tr key={membro.id} className=" hover:bg-gray-700">
                  <td className="py-2 pl-2 border-b  border-gray-300">
                    <Typography
                      variant="small"
                      color="white"
                      className="font-bold"
                    >
                      {membro.nome}
                    </Typography>
                  </td>
                  <td className="py-2  border-b border-gray-300">
                    <Typography
                      variant="small"
                      color="white"
                      className="font-norma"
                    >
                      {membro.email}
                    </Typography>
                  </td>
                  <td className="py-2  border-b border-gray-300">
                    <Typography
                      variant="small"
                      color="white"
                      className="font-normal"
                    >
                      {membro.isCriador
                        ? "Adm Criador"
                        : membro.isAdmin
                        ? "Administrador"
                        : "Membro"}
                    </Typography>
                  </td>
                  {membro.isCriador ? (
                    <td className="p-2 pr-2  border-b border-gray-300">
                      <Button variant="gradient" color="blue-gray" disabled>
                        Criador
                      </Button>
                    </td>
                  ) : membro.isAdmin ? (
                    <td className="p-2 pr-2  border-b border-gray-300">
                      <Button
                        variant="gradient"
                        color="red"
                        onClick={() =>
                          setaEAtualizaMembros(
                            membro.id,
                            props.idWorkspace,
                            false
                          )
                        }
                      >
                        Tornar Membro
                      </Button>
                    </td>
                  ) : (
                    <td className="p-2 pr-2  border-b border-gray-300">
                      <Button
                        variant="gradient"
                        color="blue"
                        onClick={() =>
                          setaEAtualizaMembros(
                            membro.id,
                            props.idWorkspace,
                            true
                          )
                        }
                      >
                        Tornar Admin
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
