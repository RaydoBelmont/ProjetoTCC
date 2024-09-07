import {buscaMembrosWorkspace,buscaMembroWorkspace,setaAdmin, inserirMembroNaWorkspace} from "../../../models/Workspace/Membros/membrosModel"

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

  export const insereMembroNaWorkspace = async (userId: number, workspaceId: number) => {
    try {
      const membroWorkspace = await inserirMembroNaWorkspace(userId, workspaceId);
      return membroWorkspace
    } catch (error) {
      console.error('Erro ao inserir Membro na Workspace no Controller:', error);
    }
  }