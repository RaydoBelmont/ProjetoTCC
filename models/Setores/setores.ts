import prisma from "../../prisma/prisma";

export const createSetor = async (
  workspaceId: number,
  nomeSetor: string,
  userId: number // ID do membro que será vinculado ao setor
) => {
  try {
    const novoSetor = await prisma.setor.create({
      data: {
        nome: nomeSetor,
        workspaceId,
        membros: {
          create: { userId }, // Vincula o membro ao novo setor
        },
      },
      include: {
        membros: true, // Inclui os membros para verificar a relação
      },
    });
    return novoSetor; // Retorna o setor criado
  } catch (error) {
    console.error("Ocorreu um erro ao criar o setor:", error);
    throw new Error("Ocorreu um erro ao criar o setor.");
  }
};


  export const getSetoresByWorkspaceIdAndUserId = async (
    workspaceId: number,
    idUser: number
  ) => {
    try {
      // Busca os setores com base no workspaceId e no membro específico (idUser)
      const setores = await prisma.setor.findMany({
        where: {
          workspaceId, // Filtro por workspace
          membros: {    // Filtro para membros do setor
            some: {     // Verifica se há pelo menos um membro que atende à condição
              userId: idUser, // Verifica se o ID do membro corresponde ao idUser fornecido
            },
          },
        },
      });
      return setores; // Retorna os setores encontrados
    } catch (error) {
      console.error("Erro ao obter os setores do workspace:", error);
      throw new Error("Ocorreu um erro ao obter os setores do workspace.");
    }
  };
  
  
  
  export const getSetor = async (idSetor: number) => {
    try {
      const setor = await prisma.setor.findUnique({
        where: {
          id: idSetor,
        },
        include: {
          membros: { // Nome do campo que define o relacionamento entre setor e membros
            include: {
              user: true, // Se `membros` é uma tabela de junção, você pode incluir os detalhes do usuário
            },
          },
        },
      });
      return setor;
    } catch (error) {
      console.error("Erro ao obter setor em model:", error);
      throw new Error("Ocorreu um erro ao obter setor em model.");
    }
  };
  

  
  export const editarNomeSetor = async (
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
  
  export const inserirMembroNoSetor = async (setorId: number, userId: number) => {
    try {
      const result = await prisma.setorMembro.create({
        data: {
          setorId,
          userId,
        },
      });
      return result;
    } catch (error: any) {
      console.error("Erro ao vincular o setor ao membro em model:", error.message);
      throw new Error("Ocorreu um erro ao vincular o setor ao membro em model.");
    }
  };
  

  export const removerMembroDoSetor = async (setorId: number, userId: number) => {
    try {
      const result = await prisma.setorMembro.delete({
        where: {
          setorId_userId: {
            setorId,
            userId,
          },
        },
      });
      return result;
    
    } catch (error: any) {
      console.error("Erro ao remover o membro do setor:", error.message);
      throw new Error("Ocorreu um erro ao remover o membro do setor.");
    }
  };
  