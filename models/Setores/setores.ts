import prisma from "../../prisma/prisma";

export const createSetorWithCreator = async (
    workspaceId: number,
    nomeSetor: string,
    userId: number
  ) => {
    try {
      // Criando o setor
      const setor = await prisma.setor.create({
        data: {
          nome: nomeSetor,
          workspaceId,
        },
      });
  
      // Vinculando o usuário criador ao setor
      await prisma.setorUser.create({
        data: {
          setorId: setor.id,
          userId,
          isAdmin: true
        },
      });
  
      return setor;
    } catch (error) {
      console.error("Erro ao criar o setor e vincular o usuário:", error);
      throw new Error(
        "Ocorreu um erro ao criar o setor e vincular o usuário criador."
      );
    }
  };
  




  export const getSetoresByWorkspaceIdAndUserId = async (
    workspaceId: number,
    userId: number
  ) => {
    try {
      const setores = await prisma.setor.findMany({
        where: {
          workspaceId,
          usuarios: {
            some: {
              userId,
            },
          },
        },
        include: {
          usuarios: true, // Include the 'usuarios' field
        },
      });
  
      return setores;
    } catch (error) {
      console.error("Erro ao obter os setores do workspace:", error);
      throw new Error("Ocorreu um erro ao obter os setores do workspace.");
    }
  };
  
  