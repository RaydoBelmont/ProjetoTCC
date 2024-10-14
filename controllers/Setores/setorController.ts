import {
  createSetor as criarSetor,
  getSetoresByWorkspaceIdAndUserId as buscarSetores,
  editarNomeSetor,
  getSetor,
  inserirMembroNoSetor,
  removerMembroDoSetor
} from "../../models/Setores/setores";

export const novoSetor = async (
  workspaceId: number,
  nomeSetor: string,
  idUser: number,
) => {
  try {
    const novoSetor = await criarSetor(workspaceId, nomeSetor, idUser);
    return novoSetor;
  } catch (error) {
    console.error("Erro na criação de novo setor em Controller",error);
  }
};

export const listarSetores = async (workspaceId: number, idUser: number) => {
    try {
        const listaDeSetores = await buscarSetores(workspaceId, idUser)
        return listaDeSetores
    } catch (error) {
        console.error("Erro na listagem de setores em Controller",error);
    }
}

export const buscaSetor = async (idSetor: number) => {
    try {
        const setor = await getSetor(idSetor)
        return setor
    } catch (error) {
        console.error("Erro ao buscar setor em Controller",error);
    }
}

export const editaNomeSetor = async (
  setorId: number,
  nomeSetor: string,
) => {
  try {
    const setor = await editarNomeSetor(setorId, nomeSetor);
    return setor;
  } catch (error) {
    console.error("Erro na edição setor em Controller",error);
  }
};

export const inserirMembro = async (setorId, userId) => {
  try {
    const result = await inserirMembroNoSetor(setorId, userId);
    return result;
  } catch (error) {
    console.error("Erro ao vincular o setor ao membro em controller:", error.message);
    throw new Error("Ocorreu um erro ao vincular o setor ao membro em controller.");
  }
}

export const removerMembro = async (setorId, userId) => { 
  try {
    const result = await removerMembroDoSetor(setorId, userId);
    return result;
  } catch (error) {
    console.error("Erro ao desvincular o setor do membro em controller:", error.message);
    throw new Error("Ocorreu um erro ao desvincular o setor do membro em controller.");
  }
}