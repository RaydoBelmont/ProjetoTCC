"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Navbar from "../navbar/navbar";
import Setor from "../Setores/setor";
import {
  buscaIdUserPorEmail,
  buscaUsuarioAdmin,
} from "../../lib/UserFunctions/buscaIDuser";
import { listaSetores } from "@/app/lib/SetoresFunctions/listarSetoresIdWorkspaceIdUser";
import CryptoJS from "crypto-js";
import { useSearchParams } from "next/navigation";
import { Membro } from "../Membros/Tabela/TabelaMembros";
import TableMembros from "../Membros/Tabela/TabelaMembros";
import { buscaMembrosWorkspace } from "../../lib/WorkspaceFunctions/Membros/buscaMembrosDaWorkspace";
import Clientes from "./Clientes/clientes";

export interface setor {
  id: number;
  nome: string;
  workspaceId: number;
}

const Workspace: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [idUser, setIdUser] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [verificaEmail, setVerificaEmail] = useState<boolean | null>(null);
  const [setores, setSetores] = useState<setor[]>([]);
  const [switchPagina, setSwitchPagina] = useState<number>(0);
  const [membros, setMembros] = useState<Membro[]>([]);

  const setaPagina = (numeroPagina: number) => {
    setSwitchPagina(numeroPagina);
  };

  const buscaSetores = listaSetores;
  const buscaPorIdTeste = buscaIdUserPorEmail;
  const buscaPorAdmin = buscaUsuarioAdmin;
  const buscaMembros = buscaMembrosWorkspace;

  const buscaEsetaMembros = async () => {
    if (session && session.user) {
      const storedWorkspaceId = Number(sessionStorage.getItem("workspaceId"));
      const idWorkspace = storedWorkspaceId;
      const membros = await buscaMembros(idWorkspace);
      setMembros(membros);
    }
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedIdUser = Number(sessionStorage.getItem("idUser"));
    const storedWorkspaceId = Number(sessionStorage.getItem("workspaceId"));
    setWorkspaceId(storedWorkspaceId);
    setWorkspaceName(String(sessionStorage.getItem("workspaceName")));
    setIdUser(storedIdUser);

    const encryptedData = searchParams.get("idWorkspace");
    if (encryptedData) {
      const secretKey = String(process.env.CHAVE_CRIPTO);

      try {
        const bytes = CryptoJS.AES.decrypt(
          decodeURIComponent(encryptedData),
          secretKey
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log(decryptedData);
      } catch (error) {
        console.error("Erro ao descriptografar dados:", error);
      }
    }

    const buscaEsetaUserID = async () => {
      if (session && session.user) {
        const emailUser = String(session?.user?.email);
        const idUserBanco = await buscaPorIdTeste(emailUser);
        if (emailUser == storedEmail && idUserBanco == storedIdUser) {
          setVerificaEmail(true);
          const dataSetores = await buscaSetores(
            Number(storedWorkspaceId),
            Number(idUserBanco)
          );
          setSetores(dataSetores);
        } else {
          setVerificaEmail(false);
        }
      }
    };

    const buscaEsetaAdmin = async () => {
      if (session && session.user) {
        const emailUser = String(session?.user?.email);
        const idWorkspace = storedWorkspaceId;
        if (emailUser == storedEmail) {
          const admin = await buscaPorAdmin(emailUser, Number(idWorkspace));
          setIsAdmin(Boolean(admin));
        } else {
          setIsAdmin(false);
        }
      }
    };

    const buscaEsetaMembros = async () => {
      if (session && session.user) {
        const idWorkspace = storedWorkspaceId;
        const membros = await buscaMembros(idWorkspace);
        setMembros(membros);
      }
    };

    buscaEsetaMembros();
    buscaEsetaUserID();
    buscaEsetaAdmin();
  }, [session, buscaPorAdmin, buscaPorIdTeste, searchParams]);

  const renderPageContent = () => {
    switch (switchPagina) {
      case 0:
        return (
          <Setor
            idWorkspace={workspaceId}
            nomeWorkspace={workspaceName}
            idUser={idUser}
            isAdmin={isAdmin}
            Setor={setores}
          />
        );
      case 1:
        return (
          <TableMembros
            membros={membros}
            atualizarMembros={buscaEsetaMembros}
            idWorkspace={workspaceId}
            nomeWorkspace={workspaceName}
          />
        );
      case 2:
        return <Clientes idWorkspace={workspaceId} />;

      // Adicione mais cases conforme necessário
      default:
        return <div>Conteúdo padrão ou uma mensagem de erro.</div>;
    }
  };

  if (verificaEmail === null) {
    return <Loading />;
  } else if (verificaEmail) {
    return (
      <main className=" flex flex-col w-full justify-between h-auto">
        <Navbar
          nome={workspaceName || ""}
          idWorkspace={workspaceId || ""}
          isAdmin={isAdmin}
          userId={Number(idUser)}
          setaPagina={setaPagina}
        />
        {renderPageContent()}
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
