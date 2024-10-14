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
import { useRouter } from "next/navigation";
import { Membro } from "../Membros/Tabela/TabelaMembros";
import TableMembros from "../Membros/Tabela/TabelaMembros";
import { buscaMembrosWorkspace } from "../../lib/WorkspaceFunctions/Membros/buscaMembrosDaWorkspace";
import Clientes from "./Clientes/clientes";
import { buscaNomeWorkspace } from "@/app/lib/WorkspaceFunctions/Workspace/libBuscaNomeWorkspace";
import { verificaUsuarioComWorkspace } from "@/app/lib/WorkspaceFunctions/Workspace/libVerificaUsuarioComWorkspace";
import { useParams } from "next/navigation";

export interface setor {
  id: number;
  nome: string;
  workspaceId: number;
}

const Workspace: React.FC = () => {
  const { data: session, status } = useSession();
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [idUser, setIdUser] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setores, setSetores] = useState<setor[]>([]);
  const [switchPagina, setSwitchPagina] = useState<number>(0);
  const [membros, setMembros] = useState<Membro[]>([]);
  const router = useRouter(); 
  const { idWorkspace } = useParams();

  const setaPagina = (numeroPagina: number) => {
    setSwitchPagina(numeroPagina);
  };

  // Função para verificar a sessão e o usuário na workspace
  const verificacaoDeUsuario = async (idWorkspace: number) => {
    try {
      const verificado = await verificaUsuarioComWorkspace(
        String(session.user.email),
        idWorkspace
      );
      return verificado;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (status === "loading") return; // Aguarda o carregamento da sessão

    if (session && session?.user) {
      if (idWorkspace) {
        try {
          const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
          const bytes = CryptoJS.AES.decrypt(
            decodeURIComponent(String(idWorkspace)),
            secretKey
          );
          const decryptedId = Number(
            JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          );

          // Verifica primeiro o usuário com a workspace antes de prosseguir
          const fetchVerificacao = async () => {
            const verificado = await verificacaoDeUsuario(decryptedId);

            if (!verificado) {
              router.push("/");
              return; // Interrompe a execução caso o usuário não seja autorizado
            }

            // Se verificado, define o ID da workspace e carrega os dados adicionais
            setWorkspaceId(decryptedId);

            await Promise.all([
              buscaESetaSetores(decryptedId),
              buscaEsetaMembros(decryptedId),
              buscaEsetaAdmin(decryptedId),
              buscaIdUser(),
              buscarNomeDaWorkspace(decryptedId),
            ]);

            setIsLoading(true); // Indica que os dados foram carregados com sucesso
          };

          fetchVerificacao();
        } catch (error) {
          console.error("Erro ao descriptografar o ID da workspace:", error);
        }
      } else {
        router.push("/");
      }
    }
  }, [session]);

  const buscaESetaSetores = async (idWorkspace: number) => {
    try {
      const idUser = await buscaIdUserPorEmail(session.user.email)
      const dataSetores = await listaSetores(idWorkspace, idUser);
      if (dataSetores) setSetores(dataSetores);
    } catch (error) {
      console.error("Erro ao buscar Setores:", error);
    }
  };

  const buscaEsetaMembros = async (idWorkspace: number) => {
    try {
      const dataMembros = await buscaMembrosWorkspace(idWorkspace);
      if (dataMembros) setMembros(dataMembros);
    } catch (error) {
      console.log("Erro ao buscar membros.");
    }
  };

  const buscaEsetaAdmin = async (idWorkspace: number) => {
    try {
      const emailUser = String(session?.user?.email);
      const dataAdmin = await buscaUsuarioAdmin(emailUser, idWorkspace);
      if (dataAdmin) setIsAdmin(Boolean(dataAdmin.isAdmin));
    } catch (error) {
      console.log("Erro ao buscar Admin.");
    }
  };

  const buscaIdUser = async () => {
    try {
      const dataUser = await buscaIdUserPorEmail(String(session.user.email));
      if (dataUser) setIdUser(dataUser);
    } catch (error) {
      console.error("Erro ao buscar ID do usuário:", error);
      return null;
    }
  };

  const buscarNomeDaWorkspace = async (idWorkspace: number) => {
    try {
      const dataWorkspace = await buscaNomeWorkspace(idWorkspace);
      if (dataWorkspace) setWorkspaceName(dataWorkspace.nome);
    } catch (error) {
      console.error("Erro ao buscar nome da Worksapce:", error);
      return null;
    }
  };

  const renderPageContent = () => {
    switch (switchPagina) {
      case 0:
        return (
          <Setor
            idWorkspace={workspaceId}
            nomeWorkspace={workspaceName}
            isAdmin={isAdmin}
            Setor={setores}
            atualizarSetores={buscaESetaSetores}
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

      default:
        return <div>Conteúdo padrão ou uma mensagem de erro.</div>;
    }
  };

  if (isLoading === null && isLoading === false) {
    return <Loading />;
  } else {
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
  }
};

export default Workspace;
