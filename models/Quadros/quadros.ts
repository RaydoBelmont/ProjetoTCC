import prisma from "../../prisma/prisma";

export const getQuadros = async (idSetor: number) => {
  try {
    const quadros = await prisma.quadro.findMany({
      where: { setorId: idSetor },
      orderBy: { id: 'asc' },
      include: {
        responsavel: true, // Traz os dados do responsável, caso necessário
      },
    });
    return quadros;
  } catch (error) {
    console.error("Erro ao buscar quadros", error);
    throw new Error("Erro ao buscar quadros");
  }
};


export const criarQuadro = async (nome: string, setorId: number, responsavelId: number) => {
  try {
    const newQuadro = await prisma.quadro.create({
      data: {
        nome: nome,
        setorId,
        responsavelId
      },
    });
    return newQuadro;
  } catch (error) {
    console.error("Erro ao criar o Quadro:", error);
    throw new Error("Ocorreu um erro ao criar o Quadro.");
  }
};


export const editarQuadro = async (nome: string, quadroId: number) => {
  try {
    const quadroEditado = await prisma.quadro.update({
      where: { id: quadroId },
      data: {
        nome,
      },
    });
    return quadroEditado;
  } catch (error) {
    console.error("Erro ao editar o Quadro:", error);
    throw new Error("Ocorreu um erro ao editar o Quadro.");
  }
};

