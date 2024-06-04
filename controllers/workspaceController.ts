import { checkAdminStatus, createWorkspace, getWorkspacesByUserId, getWorkspacesByUserIdAndName } from "../models/workspace";

export const handleSaveWorkspace = async (nome: string, userEmail: string) => {
    try {
      const newWorkspace = await createWorkspace(nome, userEmail);
      return newWorkspace

    } catch (error) {
      console.error(error);
    }
  };

  export const listarWorkspacesPorUser = async (email: string) => {
    const emailUser = email;
    try {
      const workspaces = await getWorkspacesByUserId(emailUser);
      return workspaces
    } catch (error) {
      console.error('Erro ao obter as workspaces do usuário:', error);
    }
  }

  export const buscarWorkspacePorEmaileNome = async (email: string, nome:string) => {
    try {
      const workspaces = await getWorkspacesByUserIdAndName(email, nome);
      return workspaces
    } catch (error) {
      console.error('Erro ao obter as workspaces do usuário:', error);
    }
  }

  export const verificaAdm = async (emailUsuario: string, idWorkspace:string) => {
    try {
      const isAdmin = await checkAdminStatus(emailUsuario, idWorkspace);
      return isAdmin
    } catch (error) {
      console.error('Erro ao obter as Admin do usuário em controller:', error);
    }
  }