import prisma from "../../prisma/prisma";

export const getStatus = async (
    setorId: number,
  ) => {
    try {
      const status = await prisma.status.findMany({
        where: {
          setorId: setorId,
        },
      });
      return status;
    } catch (error) {
      console.error("Erro ao obter os status do setor:", error);
      throw new Error("Ocorreu um erro ao oobter os status do setor.");
    }
  };

  export const inserirStatus = async (setorId: number, nome: string) => {
    try {
      const status = await prisma.status.create(
        {
          data: {
            nome: nome,
            setorId: setorId
          }
        }
      )
      return status
    } catch (error) {
      console.error("Erro ao criar novo status em model:", error);
      throw new Error(
        "Ocorreu um erro  ao criar novo status em model."
      );
    }
  }

  export const editarStatus = async (statusId: number, nome: string) => {
    try {
      const status = await prisma.status.update(
        {
          where:{id: statusId},
          data: {
            nome: nome,
          }
        }
      )
      return status
    } catch (error) {
      console.error("Erro ao editar status em model:", error);
      throw new Error(
        "Ocorreu um erro  ao editar status em model."
      );
    }
  }