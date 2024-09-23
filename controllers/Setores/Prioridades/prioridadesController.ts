import { getPrioridade, inserirPrioridade, editarPrioridade } from "../../../models/prioridades/prioridadesModel";

export const listaPrioridades = async (setorId: number) => {
    try {
        const listaDePrioridades = await getPrioridade(setorId)
        return listaDePrioridades
    } catch (error) {
        console.error("Erro na listagem de prioridades em Controller",error);
    }
}

export const inserePrioridades = async (setorId: number, nome: string) => {
    try {
        const prioridade = await inserirPrioridade(setorId, nome)
        return prioridade;
    } catch (error) {
        console.error("Erro na inserção de prioridades em Controller",error);
    }
}
export const editaPrioridades = async (prioridadeId: number, nome: string) => {
    try {
        const prioridade = await editarPrioridade(prioridadeId, nome)
        return prioridade;
    } catch (error) {
        console.error("Erro na edição de prioridades em Controller",error);
    }
}