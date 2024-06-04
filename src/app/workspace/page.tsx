"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Navbar from "./navbar/navbar";
import Quadro from "./quadros/quadro";
import Setor from "./Setores/setor";

const Workspace: React.FC = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [verificaEmail, setVerificaEmail] = useState<boolean | null>(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedWorkspaceId = sessionStorage.getItem("workspaceId");
    const storedWorkspaceName = sessionStorage.getItem("workspaceName");
    setEmail(storedEmail);
    setWorkspaceId(storedWorkspaceId);
    setWorkspaceName(storedWorkspaceName);

    const emailUser = session?.user?.email;
    if (session && session.user) {
      if (emailUser === storedEmail) {
        setVerificaEmail(true);
      } else {
        setVerificaEmail(false);
      }
    }
  }, [session]);

  const setores = [{id:1 , nome: "Setor Suporte"}, {id:2, nome: "Setor Dev"}]

  if (verificaEmail === null) {
    // Aguardando verificação de email
    return <Loading />;
  } else if (verificaEmail) {
    return (
      <main className=" flex flex-col w-full">
        <Navbar nome={workspaceName || ""} idWorkspace={workspaceId || ""} />
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
