import prisma from "../../prisma/prisma";

export const createSetorWithCreator = async (
    workspaceId: number,
    nomeSetor: string,
  ) => {
    try {
      const setor = await prisma.setor.create({
        data: {
          nome: nomeSetor,
          workspaceId,
        },
      });
      return setor;
    } catch (error) {
      console.error("Erro ao criar o setor o usuário:", error);
      throw new Error(
        "Ocorreu um erro ao criar o setor o usuário criador."
      );
    }
  };
  

  export const getSetoresByWorkspaceIdAndUserId = async (
    workspaceId: number,
  ) => {
    try {
      const setores = await prisma.setor.findMany({
        where: {
          workspaceId,
        },
      });
      return setores;
    } catch (error) {
      console.error("Erro ao obter os setores do workspace:", error);
      throw new Error("Ocorreu um erro ao obter os setores do workspace.");
    }
  };
  
  export const editaSetor = async (
    setorId: number,
    nomeSetor: string,
  ) => {
    try {
      const setor = await prisma.setor.update({
        where:{
          id: setorId
        },
        data: {
          nome: nomeSetor,
        },
      });
      return setor;
    } catch (error) {
      console.error("Erro ao editar o setor em model:", error);
      throw new Error(
        "Ocorreu um erro ao editar o setor em model."
      );
    }
  };
  