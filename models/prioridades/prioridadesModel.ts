import prisma from "../../prisma/prisma";

export const getPrioridade = async (
    setorId: number,
  ) => {
    try {
      const prioridades = await prisma.prioridade.findMany({
        where: {
          setorId: setorId,
        },
      });
      return prioridades;
    } catch (error) {
      console.error("Erro ao obter os prioridades do setor:", error);
      throw new Error("Ocorreu um erro ao obter os prioridades do setor.");
    }
  };

  export const inserirPrioridade = async (setorId: number, nome: string) => {
    try {
      const prioridade = await prisma.prioridade.create(
        {
          data: {
            nome: nome,
            setorId: setorId
          }
        }
      )
      return prioridade
    } catch (error) {
      console.error("Erro ao criar novo prioridade em model:", error);
      throw new Error(
        "Ocorreu um erro  ao criar novo prioridade em model."
      );
    }
  }

  export const editarPrioridade = async (prioridadeId: number, nome: string) => {
    try {
      const prioridade = await prisma.prioridade.update(
        {
          where:{id: prioridadeId},
          data: {
            nome: nome,
          }
        }
      )
      return prioridade
    } catch (error) {
      console.error("Erro ao editar prioridade em model:", error);
      throw new Error(
        "Ocorreu um erro  ao editar prioridade em model."
      );
    }
  }