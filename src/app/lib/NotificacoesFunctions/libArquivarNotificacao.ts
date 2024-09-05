export const arquivarNotificacao = async (
    notificacaoId: number,
    arquivado: boolean
  ) => {
    try {
      const response = await fetch("/api/notificacoes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificacaoId: notificacaoId,
          arquivado: arquivado,
        }),
      });
      const data = await response.json();
      if (response) {
        return data; // Retorna os dados da resposta em caso de sucesso
      } else {
        console.error("Erro ao arquivar notificação:", data.error);
        return null; // Retorna null em caso de erro
      }
    } catch (error) {
      console.error("Erro ao arquivar notificação:", error);
      return null; // Retorna null em caso de erro
    }
  };
  