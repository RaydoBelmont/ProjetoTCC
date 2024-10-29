import prisma from "../../prisma/prisma";
import { StatusEnum } from "@prisma/client";

export async function criarChamado(
  clienteId: number,
  titulo: string,
  descricao: string,
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
            id: true,
            nome: true, // Inclui o nome do cliente
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
        criadoEm: "desc",
      },
      include: {
        cliente: {
          select: {
            nome: true, // Nome do cliente associado
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
    console.error("Erro ao buscar chamados:", error);
    throw new Error("Erro ao buscar chamados");
  } finally {
    await prisma.$disconnect();
  }
};

export const buscaChamado = async (chamadoId: number) => {
  try {
    const chamado = await prisma.chamado.findUnique({
      where: {id: chamadoId},
      include: {
        cliente: {
          select: {
            nome: true, // Nome do cliente associado
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
    })
    return chamado;
  } catch (error) {
    console.error("Erro ao buscar um chamado em model:", error)
  }finally{
    await prisma.$disconnect();
  }
}

export const alterarChamado = async (
  idChamado: number,
  NovoStatus?: StatusEnum,
  idNovaPrioridade?: number,
  novaDescricao?: string,
  idNovoCliente?: number,
) => {
  if(NovoStatus){
    try {
      const chamado = await prisma.chamado.update({
        where: { id: idChamado },
        data: {
          status: NovoStatus,
        },
      });
      return chamado;
    } catch (err) {
      console.error("Erro ao alterar status do chamado:", err);
      throw new Error("Erro ao alterar status do chamado");
    } finally {
      await prisma.$disconnect();
    }
  }

  if(idNovaPrioridade){
    try {
      const chamado = await prisma.chamado.update({
        where: { id: idChamado },
        data: {
          prioridadeId: idNovaPrioridade,
        },
      });
      return chamado;
    } catch (err) {
      console.error("Erro ao alterar prioridade do chamado:", err);
      throw new Error("Erro ao alterar prioridade do chamado");
    } finally {
      await prisma.$disconnect();
    }
  }

  if(novaDescricao){
    try {
      const chamado = await prisma.chamado.update({
        where: { id: idChamado },
        data: {
          descricao: novaDescricao,
        },
      });
      return chamado;
    } catch (err) {
      console.error("Erro ao alterar descricao do chamado:", err);
      throw new Error("Erro ao alterar descricao do chamado");
    } finally {
      await prisma.$disconnect();
    }
  }
  
  if(idNovoCliente){
    try {
      const chamado = await prisma.chamado.update({
        where: { id: idChamado },
        data: {
          clienteId: idNovoCliente,
        },
      });
      return chamado;
    } catch (err) {
      console.error("Erro ao alterar cliente do chamado:", err);
      throw new Error("Erro ao alterar cliente do chamado");
    } finally {
      await prisma.$disconnect();
    }
  }
};

export async function inserirMembro(idChamado: number, idNovoMembro: number) {
  try {
    const chamado = await prisma.chamadoUser.create({
      data: {
        chamadoId: idChamado,
        userId: idNovoMembro
      },
    });
    return chamado;
  } catch (err) {
    console.error("Erro ao inserir membro no chamado em model:", err);
    throw new Error("Erro ao inserir membro no chamado em model");
  } finally {
    await prisma.$disconnect();
  }
}

export async function removerMembro(idChamado: number, idMembroRemover: number) {
  try {
    const membroRemovido = await prisma.chamadoUser.delete({
      where: {
        userId_chamadoId: {
          chamadoId: idChamado,
          userId: idMembroRemover
        }
      },
    });
    return membroRemovido;
  } catch (err) {
    console.error("Erro ao inserir membro no chamado em model:", err);
    throw new Error("Erro ao inserir membro no chamado em model");
  } finally {
    await prisma.$disconnect();
  }
}

export async function transferirChamado(idChamado: number, idQuadro: number) {
  try {
    const quadro = await prisma.chamado.update({
      where: {
        id: idChamado,
      },
      data: {
        quadroId: idQuadro
      },
    });

    return quadro ? true : false;
  } catch (err) {
    console.error("Erro ao transferir chamado model:", err);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function finalizarChamado(idChamado: number, solucao: string) {
  try {
    const chamadoFinalizado = await prisma.chamado.update({
      where:{id:idChamado},
      data:{
        status: StatusEnum.CONCLUIDO,
        solucao: solucao,
        concluidoEm: new Date(),
        arquivado: true,
        arquivadoEm: new Date(),
      }
    })

    return chamadoFinalizado ? true : false
  } catch (error) {
    console.error("Erro ao finalizar chamado em model:", error);
    throw new Error("Erro ao finalizar chamado em model");
  } finally {
    await prisma.$disconnect();
  }
}

export async function reabrirChamado(idChamado: number) {
  try {
    const chamadoReaberto = await prisma.chamado.update({
      where: {id: idChamado},
      data: {
        status: StatusEnum.EM_ABERTO,
        solucao: null,
        concluidoEm: null,
        arquivado: false,
        arquivadoEm: null,
      }
    })
    return chamadoReaberto ? true : false
  } catch (error) {
    console.error("Erro ao reabrir chamado em model:", error);
    throw new Error("Erro ao reabrir chamado em model");
  } finally {
    await prisma.$disconnect();
  }
}

export async function arquivarChamado(idChamado: number) {
  try {
    const chamadoArquivado = await prisma.chamado.update({
      where: { id: idChamado },
      data: {
        arquivado: true,
        arquivadoEm: new Date(),
      },
    });
    if (chamadoArquivado) {
      return chamadoArquivado;
    }
  } catch (error) {
    console.error("Erro ao arquivar chamado em model:", error);
    throw new Error("Erro ao arquivar chamado em model");
  } finally {
    await prisma.$disconnect();
  }
}

export async function desarquivarChamado(idChamado: number) {
  try {
    const chamadoDesarquivado = await prisma.chamado.update({
      where: { id: idChamado },
      data: {
        arquivado: false,
        arquivadoEm: null,
      },
    });
    if (chamadoDesarquivado) {
      return chamadoDesarquivado;
    }
  } catch (error) {
    console.error("Erro ao desarquivar chamado em model:", error);
    throw new Error("Erro ao desarquivar chamado em model");
  } finally {
    await prisma.$disconnect();
  }
}
