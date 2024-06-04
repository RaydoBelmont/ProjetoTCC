import prisma from "../prisma/prisma";

export const createWorkspace = async (nome: string, userEmail: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    let userId = Number(user?.id);
    // Cria a nova workspace
    const newWorkspace = await prisma.workspace.create({
      data: {
        nome,
        users: {
          // Relaciona o usuário à nova workspace
          create: {
            userId,
            isAdmin: true, // Defina como true se desejar que o usuário criador seja um administrador da workspace
          },
        },
      },
      include: {
        users: true, // Inclui os usuários associados à nova workspace na resposta
      },
    });
    return newWorkspace;
  } catch (error) {
    console.error("Erro ao criar a workspace:", error);
    throw new Error("Ocorreu um erro ao criar a workspace.");
  }
};

export const getWorkspacesByUserId = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    let userId = Number(user?.id);

    const workspaces = await prisma.workspaceUser
      .findMany({
        where: {
          userId: userId,
        },
        include: {
          workspace: true,
        },
      })
      .then((workspaceUsers) =>
        workspaceUsers.map((workspaceUser) => workspaceUser.workspace)
      );

    if (!workspaces) {
      throw new Error("Usuário não encontrado.");
    }
    return workspaces;
  } catch (error) {
    console.error("Erro ao obter as workspaces do usuário:", error);
    throw new Error("Ocorreu um erro ao obter as workspaces do usuário.");
  }
};

export const getWorkspacesByUserIdAndName = async (
  email: string,
  nome: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    let userId = Number(user.id);
    const workspaces = await prisma.workspaceUser
      .findMany({
        where: {
          userId: userId,
          workspace: {
            nome: {
              contains: nome,
              mode: "insensitive", // Para uma busca que não diferencia maiúsculas de minúsculas
            },
          },
        },
        include: {
          workspace: true,
        },
      })
      .then((workspaceUsers) =>
        workspaceUsers.map((workspaceUser) => workspaceUser.workspace)
      );

      
    if (workspaces.length === 0) {
      throw new Error("Workspaces não encontrados.");
    }
    return workspaces;
  } catch (error) {
    console.error("Erro ao obter as workspaces do usuário:", error);
    throw new Error("Ocorreu um erro ao obter as workspaces do usuário.");
  }
};

export const checkAdminStatus = async (
  emailUsuario: string,
  idWorkspace: string
) => {

  const user = await prisma.user.findUnique({
    where: { email: emailUsuario },
  });
  let userId = Number(user?.id);
  const workspaceId = Number(idWorkspace);

  try {
    // Consulta para verificar se o usuário é um administrador no workspace
    const isAdmin = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
      select: {
        isAdmin: true,
      },
    });

    // Se a consulta não retornar resultados, o usuário não pertence ao workspace ou não é um admin
    if (!isAdmin) {
      throw new Error("Usuário não encontrado ou não é um administrador.");
    }
    return isAdmin;
  } catch (error) {
    // Tratamento de erro
    console.error("Erro ao obter as Admin do usuário:", error);
  }
};
