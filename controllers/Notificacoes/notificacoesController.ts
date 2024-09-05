import {
  buscaNotificacoesPorUsuario,
  inserirNotificacao,
  marcarNotificacaoComoLido,
  marcarNotificacaoComoArquivada,
} from "../../models/Notificacoes/notificacoesModel";

export const buscaNotificacoes = async (userId: number) => {
  try {
    const notificacoes = await buscaNotificacoesPorUsuario(userId);
    return notificacoes;
  } catch (error) {
    console.error("Erro na BUSCA de NOTIFICACOES em Controller", error);
  }
};

export const novaNotificacao = async (
  userId: number,
  tipo: string,
  mensagem: string,
  workspaceId?: number
) => {
  try {
    const notificao = await inserirNotificacao(
      userId,
      tipo,
      mensagem,
      workspaceId
    );
    return notificao;
  } catch (error) {
    console.error("Erro na criação de uma NOVA NOTIFICACAO em Controller", error);
  }
};

export const lerNotificacao = async (notificacaoId: number, lido: boolean) => {
    try {
        const notificacaoLida = await marcarNotificacaoComoLido(notificacaoId,lido)
        return notificacaoLida
    } catch (error) {
        console.error("Erro ao atualizar o status de leitura da notificação em Controller", error);     
    }
}

export const arquivarNotificacao = async (notificacaoId: number, arquivado: boolean) => {
    try {
        const notificacaoArquivada = await marcarNotificacaoComoArquivada(notificacaoId,arquivado)
        return notificacaoArquivada
    } catch (error) {
        console.error("Erro ao ARQUIVAR notificação em Controller", error);     
    }
}