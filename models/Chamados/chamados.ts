import prisma from "../../prisma/prisma";

export async function criarChamado(
  clienteId: number,
  titulo: string,
  descricao: string,
  statusId: number,
  membroId: number,
  quadroId: number,
  workspaceId: number
) {
  try {
    const novoChamado = await prisma.chamado.create({
      data: {
        titulo: titulo,
        descricao: descricao,
        statusId: statusId, // ID de status pré-existente
        criadoPor: membroId, // ID do usuário que está criando o chamado
        clienteId: clienteId, // ID do cliente associado ao chamado
        quadroId: quadroId, // ID do quadro onde o chamado pertence
        workspaceId: workspaceId, // ID da workspace do chamado
        numeroSequencial: await gerarNumeroSequencial(workspaceId), // Função para gerar número sequencial para workspaceId 1
        users: {
          create: {
            user: {
              connect: { id: membroId }, // ID do usuário que está relacionado ao chamado
            },
          },
        },
      },
    });

    console.log("Chamado criado com sucesso:", novoChamado);
  } catch (error) {
    console.error("Erro ao criar chamado:", error);
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
          quadroId: quadroId, // Filtra pelo ID do usuário
        },
        orderBy: {
          criadoEm: 'desc', // Ordena as notificações pela data de criação, do mais recente para o mais antigo
        },
      });
  
      return chamados;
    } catch (error) {
      console.error('Erro ao obter notificações do usuário:', error);
      return [];
    }
  };