import prisma from "../../../prisma/prisma";

export const setaAdmin = async (workspaceId: number, userId: number, isAdmin: boolean) => {
  try {
    // Verificar se o registro existe antes de atualizar
    const existingUser = await prisma.workspaceUser.findUnique({
      where: { 
        userId_workspaceId: { userId, workspaceId }
      }
    });

    if (!existingUser) {
      throw new Error("O usuário não existe no workspace especificado.");
    }

    const updatedUser = await prisma.workspaceUser.update({
      where: { 
        userId_workspaceId: { userId, workspaceId }
      },
      data: { isAdmin },
    });

    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar o status do admin:", error);
    throw new Error("Ocorreu um erro ao atualizar o status do admin.");
  }
}



export const buscaMembrosWorkspace = async (workspaceId: number) => {
  try {
    const users = await prisma.workspaceUser.findMany({
      where: {
        workspaceId: workspaceId, // Filtro pelo ID da workspace
      },
      select: {
        isAdmin: true, // Seleciona se o usuário é admin ou não
        isCriador: true,
        user: {
          select: {
            id: true,
            nome: true,   // Seleciona o nome do usuário
            email: true,  // Seleciona o email do usuário
          },
        },
      },
    });

    return users.map((workspaceUser) => ({
      id: workspaceUser.user.id,
      nome: workspaceUser.user.nome,
      email: workspaceUser.user.email,
      isAdmin: workspaceUser.isAdmin,
      isCriador: workspaceUser.isCriador
    }));
  } catch (error) {
    console.error('Erro ao obter Membros da Workspace em model:', error);
    return [];
  }
}

export const buscaMembroWorkspace = async (workspaceId: number, userId: number) => {
  try {
    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId: workspaceId, // Filtro pelo ID da workspace
        userId: userId,           // Filtro pelo ID do usuário
      },
      select: {
        isAdmin: true, // Seleciona se o usuário é admin ou não
        isCriador: true,
        user: {
          select: {
            id: true,
            nome: true,   // Seleciona o nome do usuário
            email: true,  // Seleciona o email do usuário
          },
        },
      },
    });

    // Se um usuário foi encontrado, retorna as informações dele
    if (workspaceUser) {
      return {
        id: workspaceUser.user.id,
        nome: workspaceUser.user.nome,
        email: workspaceUser.user.email,
        isAdmin: workspaceUser.isAdmin,
        isCriador: workspaceUser.isCriador,
        usuarioExiste: true
      };
    } else {
      return {usuarioExiste: false}; // Retorna null se o usuário não for encontrado
    }
  } catch (error) {
    console.error('Erro ao obter Membro da Workspace em model:', error);
    return null; // Retorna null em caso de erro
  }
};
