import { NextResponse } from "next/server";
import prisma from '../prisma/prisma';


export const createWorkspace = async (nome: string, userEmail: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    let userId = Number(user?.id)
    // Cria a nova workspace
    const newWorkspace = await prisma.workspace.create({
      data: {
        nome,
        users: { // Relaciona o usuário à nova workspace
          create: {
            userId,
            isAdmin: true // Defina como true se desejar que o usuário criador seja um administrador da workspace
          }
        }
      },
      include: {
        users: true // Inclui os usuários associados à nova workspace na resposta
      }
    });

    return newWorkspace;
  } catch (error) {
    console.error('Erro ao criar a workspace:', error);
    throw new Error('Ocorreu um erro ao criar a workspace.');
  }
};

export const getWorkspacesByUserId = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    let userId = Number(user?.id)

    const workspaces = await prisma.workspaceUser.findMany({
      where: {
        userId: userId
      },
      include: {
        workspace: true
      }
    }).then(workspaceUsers => workspaceUsers.map(workspaceUser => workspaceUser.workspace))

    if (!workspaces) {
      throw new Error('Usuário não encontrado.');
    }
    return workspaces;
  } catch (error) {
    console.error('Erro ao obter as workspaces do usuário:', error);
    throw new Error('Ocorreu um erro ao obter as workspaces do usuário.');
  }
};