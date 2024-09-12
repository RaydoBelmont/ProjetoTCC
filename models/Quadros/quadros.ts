import prisma from "../../prisma/prisma";

export const getQuadros = async (idSetor: number) => {
  try {
    const quadros = await prisma.quadro.findMany({
      where: { setorId: idSetor },
      orderBy: { id: 'asc' },
    });
    return quadros;
  } catch (error) {
    console.error("Erro ao buscar quadros", error);
    throw new Error("Erro ao buscar quadros");
  }
};


export const criarQuadro = async (nome: string, setorId: number) => {
  try {
    const newQuadro = await prisma.quadro.create({
      data: {
        nome: nome,
        setorId: setorId
      },
    });
    return newQuadro;
  } catch (error) {
    console.error("Erro ao criar a Quadro:", error);
    throw new Error("Ocorreu um erro ao criar a Quadro.");
  }
};

export const editarQuadro = async (nome: string, quadroId: number) => {
  try {
    const quadroEditado = await prisma.quadro.update({
      where:{id: quadroId},
      data: {
        nome: nome
      },
    });
    return quadroEditado;
  } catch (error) {
    console.error("Erro ao editar a Quadro:", error);
    throw new Error("Ocorreu um erro ao editar a Quadro.");
  }
};

