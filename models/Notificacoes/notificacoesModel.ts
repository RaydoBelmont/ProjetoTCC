import prisma from "../../prisma/prisma";

export const buscaNotificacoesPorUsuario = async (userId: number) => {
    try {
      const notificacoes = await prisma.notificacao.findMany({
        where: {
          userId: userId, // Filtra pelo ID do usuário
        },
        select: {
          id: true,
          tipo: true,
          mensagem: true,
          workspaceId: true,
          dataCriacao: true,
          lido: true,
          arquivado: true,
        },
        orderBy: {
          dataCriacao: 'desc', // Ordena as notificações pela data de criação, do mais recente para o mais antigo
        },
      });
  
      return notificacoes;
    } catch (error) {
      console.error('Erro ao obter notificações do usuário:', error);
      return [];
    }
  };
  
  export const inserirNotificacao = async (
    userId: number,
    tipo: string,
    mensagem: string,
    workspaceId?: number // Opcional, dependendo do tipo de notificação
  ) => {
    try {
      const novaNotificacao = await prisma.notificacao.create({
        data: {
          userId: userId,
          tipo: tipo,
          mensagem: mensagem,
          workspaceId: workspaceId || null, // Se `workspaceId` for fornecido, usa o valor; caso contrário, define como `null`
        },
      });
  
      return novaNotificacao;
    } catch (error) {
      console.error('Erro ao inserir notificação:', error);
      return null; // Retorna null em caso de erro
    }
  };
  
  export const marcarNotificacaoComoLido = async (notificacaoId: number, lido: boolean) => {
    try {
      const notificacaoAtualizada = await prisma.notificacao.update({
        where: {
          id: notificacaoId, // ID da notificação a ser atualizada
        },
        data: {
          lido: lido, // Define se a notificação foi lida ou não
        },
      });
      return notificacaoAtualizada.lido;
    } catch (error) {
      console.error('Erro ao atualizar o status de leitura da notificação:', error);
      return null; // Retorna null em caso de erro
    }
  };

  export const marcarNotificacaoComoArquivada = async (notificacaoId: number, arquivado: boolean) => {
    try {
      const notificacaoAtualizada = await prisma.notificacao.update({
        where: {
          id: notificacaoId, // ID da notificação a ser atualizada
        },
        data: {
          arquivado: arquivado, // Define se a notificação está arquivada ou não
        },
      });
  
      return notificacaoAtualizada.arquivado;
    } catch (error) {
      console.error('Erro ao atualizar o status de arquivamento da notificação:', error);
      return null; // Retorna null em caso de erro
    }
  };
  