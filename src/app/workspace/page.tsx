"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Workspace: React.FC = () => {
  const { data: session } = useSession();

  
  const email = localStorage.getItem("email");
  const workspaceId = localStorage.getItem("workspaceId");
  const workspaceName = localStorage.getItem("workspaceName");
  const [verificaEmail, setVerificaEmail] = useState<boolean>(false);
  const [listaQuadros, setListaQuadros] = useState<[]>([]);

  const listarQuadros = async () => {
    const result = await fetch;
  };

  useEffect(() => {
    const emailUser = session?.user?.email;
    if (session && session.user) {
      if (emailUser === email) {
        setVerificaEmail(true);
      } else setVerificaEmail(false);
    }
  }, [session]);

  if (verificaEmail) {
    return (
      <div className="flex flex-col h-screen w-full">
        <header className="bg-gray-600 text-white p-4 flex items-center justify-between h-10"></header>
        <h1>Bem vindo {email}</h1>
        <h2>Workspace: {workspaceName}</h2>
        <h2>WorkspaceID: {workspaceId}</h2>
      </div>
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
