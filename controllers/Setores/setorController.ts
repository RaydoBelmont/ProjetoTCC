import {
  createSetorWithCreator as criarSetor,
  getSetoresByWorkspaceIdAndUserId as buscarSetores,
  editaSetor
} from "../../models/Setores/setores";

export const novoSetor = async (
  workspaceId: number,
  nomeSetor: string,
) => {
  try {
    const novoSetor = await criarSetor(workspaceId, nomeSetor);
    return novoSetor;
  } catch (error) {
    console.error("Erro na criação de novo setor em Controller",error);
  }
};

export const listarSetores = async (workspaceId: number) => {
    try {
        const listaDeSetores = await buscarSetores(workspaceId)
        return listaDeSetores
    } catch (error) {
        console.error("Erro na listagem de setores em Controller",error);
    }
}

export const editarSetor = async (
  setorId: number,
  nomeSetor: string,
) => {
  try {
    const setor = await editaSetor(setorId, nomeSetor);
    return setor;
  } catch (error) {
    console.error("Erro na edição setor em Controller",error);
  }
};
