import {buscaMembrosWorkspace} from "../../../models/Workspace/buscaMembrosWorkspace"

export const listarMembrosWorkspace = async (workspaceId: number) => {
    try {
      const users = await buscaMembrosWorkspace(workspaceId);
      return users
    } catch (error) {
      console.error('Erro ao obter as Membros da Workspace em Controller:', error);
    }
  }