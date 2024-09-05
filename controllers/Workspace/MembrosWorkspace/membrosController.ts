import {buscaMembrosWorkspace,buscaMembroWorkspace,setaAdmin} from "../../../models/Workspace/Membros/membrosModel"

export const setarAdmin = async (workspaceId: number, userId: number, isAdmin: boolean) => {
  try {
    const userUpdate = await setaAdmin(workspaceId, userId, isAdmin);
    return userUpdate
  } catch (error) {
    console.error('Erro ao Setar Admin no Controller:', error);
  }
}

export const listarMembrosWorkspace = async (workspaceId: number) => {
    try {
      const users = await buscaMembrosWorkspace(workspaceId);
      return users
    } catch (error) {
      console.error('Erro ao obter as Membros da Workspace em Controller:', error);
    }
  }

export const getMembroWorkspace = async (workspaceId: number, userId: number) => {
    try {
      const user = await buscaMembroWorkspace(workspaceId, userId);
      return user
    } catch (error) {
      console.error('Erro ao obter as MembrO da Workspace em Controller:', error);
    }
  }