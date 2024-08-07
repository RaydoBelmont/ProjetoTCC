"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Navbar from "./navbar/navbar";
import Quadro from "./quadros/quadro";
import Setor from "./Setores/setor";

export interface setor {
  id: number;
  nome: string;
  workspaceId: number;
}

const Workspace: React.FC = () => {
  const { data: session } = useSession();
  const [userEmail, setEmail] = useState<string | null>(
    String(session?.user?.email)
  );
  console.log(userEmail);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [verificaEmail, setVerificaEmail] = useState<boolean | null>(null);
  const [switchSetor, setSwitchSetor] = useState<boolean>(true);
  const [setores, setSetores] = useState<setor[]>([]);
  const [idUsuario, setIdUsuario] = useState<Number>();

  const listaSetores = async (idWorkspace: number, idUser: number) => {
    try {
      const response = await fetch(
        "/api/workspace/setor?idWorkspace=" + idWorkspace + "&idUser=" + idUser
      );
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setSetores(data);
      } else {
        console.error("Erro: data.setores é undefined ou não é um array");
      }
    } catch (error) {
      console.error("Erro ao carregar os setores:", error);
    }
  };

  const buscaUsuario = async (email: string) => {
    try {
      const response = await fetch("/api/workspace/users?email=" + email);
      const data = await response.json();
      console.log(data);
      if (data && Array.isArray(data)) {
        console.log(data);
        setIdUsuario(Number(data));
      } else {
        console.error("Erro: data.usuario é undefined ou não é um array");
      }
    } catch (error) {
      console.error("Erro ao carregar o usuario:", error);
    }
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedWorkspaceId = sessionStorage.getItem("workspaceId");
    const storedWorkspaceName = sessionStorage.getItem("workspaceName");

    // setEmail(storedEmail);
    // console.log(String(session?.user?.email));
    setWorkspaceId(storedWorkspaceId);
    setWorkspaceName(storedWorkspaceName);
    // buscaUsuario(String(userEmail));
    console.log(idUsuario);
    listaSetores(Number(workspaceId), Number(idUsuario));

    const emailUser = session?.user?.email;
    if (session && session.user) {
      if (emailUser === storedEmail) {
        setVerificaEmail(true);
      } else {
        setVerificaEmail(false);
      }
    }
  }, [session]);

  if (verificaEmail === null) {
    // Aguardando verificação de email
    return <Loading />;
  } else if (verificaEmail) {
    return (
      <main className=" flex flex-col w-full">
        <Navbar
          nome={workspaceName || ""}
          idWorkspace={workspaceId || ""}
          setorStatus={switchSetor}
          idUser={Number(idUsuario)}
        />

        {/* <Quadro idWorkspace={workspaceId || ""} /> */}
        <Setor Setor={setores} />
      </main>
    );
  } else {
    return (
      <div>
        <h1>Erro: O email da sessão não corresponde ao email salvo.</h1>
      </div>
    );
  }
};

export default Workspace;
