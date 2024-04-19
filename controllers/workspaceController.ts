import { createWorkspace, getWorkspacesByUserId } from "../models/workspace";

export const handleSaveWorkspace = async (nome: string, userEmail: string) => {
    try {
      const newWorkspace = await createWorkspace(nome, userEmail);
      return newWorkspace

    } catch (error) {
      console.error(error);
    }
  };

  export const listarWorkspacesPorUser = async (email: string) => {
    const emailUser = email; // Substitua pelo ID do usuário desejado
    try {
      const workspaces = await getWorkspacesByUserId(emailUser);
      return workspaces
    } catch (error) {
      console.error('Erro ao obter as workspaces do usuário:', error);
    }
  }