import { createQuadros, getQuadros } from "../models/quadros";

export const savarQuadro = async (nome: string, workspaceId: string) => {
    try {
      const novoQuadro = await createQuadros(nome, workspaceId);
      return novoQuadro

    } catch (error) {
      console.error(error);
    }
  };

  export const listarQuadros = async (workspaceId: string) => {
    try {
      const quadros = await getQuadros(workspaceId);
      return quadros
    } catch (error) {
      console.error('Erro ao obter as quadros do usuário:', error);
    }
  }