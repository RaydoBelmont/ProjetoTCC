import { getQuadros,criarQuadro,editarQuadro } from "../../models/Quadros/quadros";


export const listarQuadros = async (idSetor: number) => {
  try {
    const quadros = await getQuadros(idSetor);
    return quadros
  } catch (error) {
    console.error('Erro ao obter Quadros em Controllet:', error);
  }
}
export const savarQuadro = async (nome: string, idSetor: number, resposavelId: number) => {
    try {
      const novoQuadro = await criarQuadro(nome, idSetor, resposavelId);
      return novoQuadro

    } catch (error) {
      console.error('Erro ao criar Quadro em Controllet:', error);
    }
  };

  export const editQuadro = async (nome: string, quadroId: number) => {
    try {
      const quadroEditado = await editarQuadro(nome, quadroId);
      return quadroEditado

    } catch (error) {
      console.error('Erro ao editar Quadro em Controllet:', error);
    }
  };