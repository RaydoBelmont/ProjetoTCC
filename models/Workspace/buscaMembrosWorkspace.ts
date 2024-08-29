import prisma from "../../prisma/prisma";

export const buscaMembrosWorkspace = async (workspaceId: number) => {
  try {
    const users = await prisma.workspaceUser.findMany({
      where: {
        workspaceId: workspaceId, // Filtro pelo ID da workspace
      },
      select: {
        isAdmin: true, // Seleciona se o usuário é admin ou não
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
    }));
  } catch (error) {
    console.error('Erro ao obter Membros da Workspace em model:', error);
    return [];
  }
}
