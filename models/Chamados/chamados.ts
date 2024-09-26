import prisma from "../../prisma/prisma";

export async function criarChamado(
  clienteId: number,
  titulo: string,
  descricao: string,
  statusId: number,
  prioridadeId: number,
  membroId: number,
  quadroId: number,
  workspaceId: number
) {
  try {
    const novoChamado = await prisma.chamado.create({
      data: {
        titulo: titulo,
        descricao: descricao,
        statusId: statusId,
        prioridadeId: prioridadeId,
        criadoPor: membroId,
        clienteId: clienteId,
        quadroId: quadroId,
        workspaceId: workspaceId,
        numeroSequencial: await gerarNumeroSequencial(workspaceId),
        users: {
          create: {
            user: {
              connect: { id: membroId },
            },
          },
        },
      },
      include: {
        cliente: {
          select: {
            nome: true, // Inclui o nome do cliente
          },
        },
        status: {
          select: {
            nome: true, // Inclui o nome do status
          },
        },
        prioridade: {
          select: {
            nome: true, // Inclui o nome da prioridade
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                nome: true, // Inclui os IDs e nomes dos usuários relacionados
              },
            },
          },
        },
      },
    });

    return novoChamado;
  } catch (error) {
    console.error("Erro ao criar chamado:", error);
    throw new Error("Erro ao criar chamado");
  } finally {
    await prisma.$disconnect();
  }
}

async function gerarNumeroSequencial(workspaceId: number): Promise<number> {
  const ultimoChamado = await prisma.chamado.findFirst({
    where: { workspaceId },
    orderBy: { numeroSequencial: "desc" },
  });

  return ultimoChamado ? ultimoChamado.numeroSequencial + 1 : 1;
}


export const buscarChamadosPorQuadro = async (quadroId: number) => {
  try {
    const chamados = await prisma.chamado.findMany({
      where: {
        quadroId: quadroId,
      },
      orderBy: {
        criadoEm: 'desc',
      },
      include: {
        cliente: {
          select: {
            nome: true, // Nome do cliente associado
          },
        },
        status: {
          select: {
            nome: true, // Nome do status
          },
        },
        prioridade: {
          select: {
            nome: true, // Nome da prioridade
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                nome: true, // IDs e nomes dos usuários associados
              },
            },
          },
        },
        quadro: {
          select: {
            nome: true, // Nome do quadro associado
          },
        },
      },
    });

    return chamados;
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    throw new Error("Erro ao buscar chamados");
  } finally {
    await prisma.$disconnect();
  }
};
