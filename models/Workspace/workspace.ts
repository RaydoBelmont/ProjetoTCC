import prisma from "../../prisma/prisma";

export const createWorkspace = async (nome: string, userEmail: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    let userId = Number(user?.id);

    const newWorkspace = await prisma.workspace.create({
      data: {
        nome,
        users: {
          // Relaciona o usuário à nova workspace
          create: {
            userId,
            isAdmin: true,
            isCriador: true,
          },
        },
      },
      include: {
        users: true,
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

export const getWorkspaceName = async (workspaceId: number) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        nome: true,
      },
    });

    return workspace;
  } catch (error) {
    console.error("Erro ao obter o nome da workspace.", error);
    throw new Error("Erro ao obter o nome da workspace.");
  }
};

export const checkAdminStatus = async (
  emailUsuario: string,
  idWorkspace: number
) => {
  const user = await prisma.user.findUnique({
    where: { email: emailUsuario },
  });

  let userId = Number(user?.id);
  const workspaceId = Number(idWorkspace);

  try {
    const response = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });
    if (!response) {
      throw new Error("Usuário não encontrado ou não é um administrador.");
    } else return response;
  } catch (error) {
    // Tratamento de erro
    console.error("Erro ao obter as Admin do usuário:", error);
  }
};


export const verificaUsuarioComWorkspace = async (email: string, idWorkspace: number) => {
  try {
    // Buscar o usuário com base no e-mail
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // Se o usuário não for encontrado, retorna false
    if (!user) {
      return false;
    }

    // Verificar se o usuário pertence à workspace
    const verificacao = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: Number(user.id),
          workspaceId: idWorkspace,
        },
      },
    });

    return verificacao ? true : false;
  } catch (error) {
    console.error("Erro ao verificar se o usuário pertence à workspace MODEL:", error);
    return false; // Retorna false em caso de erro
  }
};


