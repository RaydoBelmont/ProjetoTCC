"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Navbar from "../navbar/navbar";
import Setor from "../Setores/setor";
import {
  buscaUsuarioAdmin,
} from "../../lib/UserFunctions/buscaIDuser";
import { listaSetores } from "@/app/lib/SetoresFunctions/listarSetoresIdWorkspaceIdUser";
import CryptoJS from "crypto-js";
import { redirect,  } from "next/navigation";
import { Membro } from "../Membros/Tabela/TabelaMembros";
import TableMembros from "../Membros/Tabela/TabelaMembros";
import { buscaMembrosWorkspace } from "../../lib/WorkspaceFunctions/Membros/buscaMembrosDaWorkspace";
import Clientes from "./Clientes/clientes";
import { useParams } from 'next/navigation';


export interface setor {
  id: number;
  nome: string;
  workspaceId: number;
}

const Workspace: React.FC = () => {
  const { data: session } = useSession();
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

  const buscaEsetaMembros = async () => {
    if (session && session.user) {
      const storedWorkspaceId = Number(sessionStorage.getItem("workspaceId"));
      const idWorkspace = storedWorkspaceId;
      const membros = await buscaMembrosWorkspace(idWorkspace);
      setMembros(membros);
    }
  };

  const atualizaSetores = async (workspaceId: number) => {
    try {
      const setores = await listaSetores(workspaceId);
      if(setores){
        setSetores(setores)
      }
    } catch (error) {
      console.log("Erro ao buscar setores.")
    }
  }

  const { idWorkspace } = useParams();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedIdUser = Number(sessionStorage.getItem("idUser"));
    const storedWorkspaceId = Number(sessionStorage.getItem("workspaceId"));
    setWorkspaceId(storedWorkspaceId);
    setWorkspaceName(String(sessionStorage.getItem("workspaceName")));
    setIdUser(storedIdUser);

    
    const encryptedData = String(idWorkspace)
    console.log(encryptedData)
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

    const buscaESetaSetores = async () => {
      if (session && session.user) {
        const emailUser = String(session?.user?.email);
        if (emailUser == storedEmail) {
          setVerificaEmail(true);
          const dataSetores = await listaSetores(Number(storedWorkspaceId));
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
          const admin = await buscaUsuarioAdmin(emailUser, Number(idWorkspace));
          setIsAdmin(Boolean(admin));
        } else {
          setIsAdmin(false);
        }
      }
    };

    if (session && session.user) {
      const buscaDadosIniciais = async () => {
        await Promise.all([
          buscaEsetaMembros(),
          buscaESetaSetores(),
          buscaEsetaAdmin()
        ]);
      };
  
      buscaDadosIniciais();
    }
  }, [session]);

  const renderPageContent = () => {
    switch (switchPagina) {
      case 0:
        return (
          <Setor
            idWorkspace={workspaceId}
            nomeWorkspace={workspaceName}
            isAdmin={isAdmin}
            Setor={setores}
            atualizarSetores={atualizaSetores}
          />
        );
      case 1:
        return (
          <TableMembros
            membros={membros}
            atualizarMembros={buscaEsetaMembros}
            idWorkspace={workspaceId}
            nomeWorkspace={workspaceName}
            userAdmin={isAdmin}
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
    return redirect("/");
  }
};

export default Workspace;
