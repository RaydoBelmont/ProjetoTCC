import {
  createSetorWithCreator as criarSetor,
  getSetoresByWorkspaceIdAndUserId as buscarSetores,
} from "../../models/Setores/setores";

export const novoSetor = async (
  workspaceId: number,
  nomeSetor: string,
  userId: number
) => {
  try {
    const novoSetor = await criarSetor(workspaceId, nomeSetor, userId);
    return novoSetor;
  } catch (error) {
    console.error("Erro na criação de novo setor em Controller",error);
  }
};

export const listarSetoresPorUser = async (workspaceId: number, userId: number) => {
    try {
        const listaDeSetores = await buscarSetores(workspaceId, userId)
        return listaDeSetores
    } catch (error) {
        console.error("Erro na listagem de setores em Controller",error);
    }
}
