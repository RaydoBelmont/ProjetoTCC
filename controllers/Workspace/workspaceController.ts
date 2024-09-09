import {
  checkAdminStatus,
  createWorkspace,
  getWorkspacesByUserId,
  getWorkspaceName,
  verificaUsuarioComWorkspace
} from "../../models/Workspace/workspace";

export const handleSaveWorkspace = async (nome: string, userEmail: string) => {
  try {
    const newWorkspace = await createWorkspace(nome, userEmail);
    return newWorkspace;
  } catch (error) {
    console.error(error);
  }
};

export const listarWorkspacesPorUser = async (email: string) => {
  const emailUser = email;
  try {
    const workspaces = await getWorkspacesByUserId(emailUser);
    return workspaces;
  } catch (error) {
    console.error("Erro ao obter as workspaces do usuário:", error);
  }
};

export const buscaNomeWorkspace = async (workspaceId: number) => {
  try {
    const nomeWorkspace = await getWorkspaceName(workspaceId);
    return nomeWorkspace;
  } catch (error) {
    console.error("Erro ao buscar nome da workspace:", error);
  }
};

export const verificaAdm = async (
  emailUsuario: string,
  idWorkspace: number
) => {
  try {
    const isAdmin = await checkAdminStatus(emailUsuario, idWorkspace);
    return isAdmin;
  } catch (error) {
    console.error("Erro ao obter as Admin do usuário em controller:", error);
  }
};

export const verificaUsuarioEWorkspace = async (
  emailUsuario: string,
  idWorkspace: number
) => {
  try {
    const verificacao = await verificaUsuarioComWorkspace(emailUsuario, idWorkspace);
    return verificacao;
  } catch (error) {
    console.error("Erro ao verificar usuário em controller:", error);
  }
};

