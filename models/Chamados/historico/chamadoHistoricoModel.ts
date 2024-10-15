import prisma from "../../../prisma/prisma";

export async function getHistoricoChamado(idChamado: number) {
  try {
    const historico = await prisma.chamadoHistorico.findMany({
      where: { chamadoId: idChamado },
      orderBy: {
        criadoEm: "desc",
      },
      include: {
        // Inclui o usuário que fez a alteração
        user: {
          select: {
            nome: true, // Retorna o nome do usuário
          },
        },
      },
    });

    // Mapeia o resultado para buscar o nome correspondente ao tipo (Status, Prioridade, Cliente, etc.)
    const historicoFormatado = await Promise.all(
      historico.map(async (item) => {
        let nomeAnterior = null;
        let nomeNovo = null;

        if (item.tipo === "Status" && item.valorAnterior && item.valorNovo) {


          nomeAnterior = item.valorAnterior || "Desconhecido";
          nomeNovo = item.valorNovo|| "Desconhecido";
        } else if (item.tipo === "Prioridade" && item.valorAnterior && item.valorNovo) {
          // Busca os nomes das prioridades
          const prioridadeAnterior = await prisma.prioridade.findUnique({
            where: { id: Number(item.valorAnterior) },
            select: { nome: true },
          });

          const prioridadeNovo = await prisma.prioridade.findUnique({
            where: { id: Number(item.valorNovo) },
            select: { nome: true },
          });

          nomeAnterior = prioridadeAnterior?.nome || "Desconhecido";
          nomeNovo = prioridadeNovo?.nome || "Desconhecido";
        } else if (item.tipo === "Cliente" && item.valorAnterior && item.valorNovo) {
          // Busca os nomes dos clientes
          const clienteAnterior = await prisma.clientes.findUnique({
            where: { id: Number(item.valorAnterior) },
            select: { nome: true },
          });

          const clienteNovo = await prisma.clientes.findUnique({
            where: { id: Number(item.valorNovo) },
            select: { nome: true },
          });

          nomeAnterior = clienteAnterior?.nome || "Desconhecido";
          nomeNovo = clienteNovo?.nome || "Desconhecido";
        }

        return {
          ...item,
          nomeUsuario: item.user?.nome || "Usuário desconhecido",
          nomeAnterior: nomeAnterior,
          nomeNovo: nomeNovo,
        };
      })
    );

    return historicoFormatado;
  } catch (error) {
    console.error("Erro ao buscar historico do chamado em model:", error);
    throw new Error("Erro ao buscar historico do chamado em model.");
  } finally {
    await prisma.$disconnect();
  }
}


export async function putHistoricoChamado(
  chamadoId: number,
  alteradoPorId: number,
  tipo: string,
  descricao: string,
  valorAnterior?: string,
  valorNovo?: string
) {
    try {
      const historico = await prisma.chamadoHistorico.create({
        data: {
          chamadoId: chamadoId,
          alteradoPorId: alteradoPorId,
          tipo: tipo,
          descricao: descricao,
          valorAnterior: valorAnterior,
          valorNovo: valorNovo,
        },
      });
      return historico;
    } catch (error) {
      console.error("Erro ao salvar historico do chamado em model:", error);
      throw new Error("Erro ao salvar historico do chamado em model.");
    } finally {
      await prisma.$disconnect();
    }
  
}
