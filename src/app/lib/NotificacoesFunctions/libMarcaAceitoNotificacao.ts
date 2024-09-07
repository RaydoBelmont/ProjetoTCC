export const libAceitarNotificacao = async (
    notificacaoId: number,
    aceito: boolean
  ) => {
    try {
      const response = await fetch("/api/notificacoes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificacaoId: notificacaoId,
          aceito: aceito,
        }),
      });
      const data = await response.json();
      if (response) {
        return data; // Retorna os dados da resposta em caso de sucesso
      } else {
        console.error("Erro ao ACEITAR notificação:", data.error);
        return null; // Retorna null em caso de erro
      }
    } catch (error) {
      console.error("Erro ao ACEITAR notificação:", error);
      return null; // Retorna null em caso de erro
    }
  };
  