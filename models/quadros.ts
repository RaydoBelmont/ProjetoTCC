import prisma from "../prisma/prisma";

export const createQuadros = async (nome: string, workspaceId: string) => {
  try {
    const newQuadro = await prisma.quadro.create({
      data: {
        nome,
        workspaceId: Number(workspaceId),
      },
    });

    return newQuadro;
  } catch (error) {
    console.error("Erro ao criar a Quadro:", error);
    throw new Error("Ocorreu um erro ao criar a Quadro.");
  }
};

export const getQuadros = async (workspaceId: string) => {
  const numeroWorkspace = Number(workspaceId);
  if (isNaN(numeroWorkspace)) {
    throw new Error("workspaceId fornecido não é um número válido");
  }
  try {
    const quadros = await prisma.quadro.findMany({
      where: { workspaceId: numeroWorkspace },
    });
    return quadros;
  } catch (error) {
    console.error("Erro ao buscar quadros", error);
    throw new Error("Erro ao buscar quadros");
  }
};
