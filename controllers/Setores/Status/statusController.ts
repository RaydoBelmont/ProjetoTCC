import { getStatus, inserirStatus, editarStatus } from "../../../models/Status/statusModel";

export const listaStatus = async (setorId: number) => {
    try {
        const listaDeStatus = await getStatus(setorId)
        return listaDeStatus
    } catch (error) {
        console.error("Erro na listagem de status em Controller",error);
    }
}

export const insereStatus = async (setorId: number, nome: string) => {
    try {
        const status = await inserirStatus(setorId, nome)
        return status;
    } catch (error) {
        console.error("Erro na inserção de Status em Controller",error);
    }
}
export const editaStatus = async (statusId: number, nome: string) => {
    try {
        const status = await editarStatus(statusId, nome)
        return status;
    } catch (error) {
        console.error("Erro na edição de Status em Controller",error);
    }
}