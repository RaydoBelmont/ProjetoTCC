export const libLerNotificacao = async (
  notificacaoId: number,
  lido: boolean
) => {
  try {
    const response = await fetch("/api/notificacoes", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificacaoId: notificacaoId,
        lido: lido,
      }),
    });
    const data = await response.json();
    if (response) {
      return data; // Retorna os dados da resposta em caso de sucesso
    } else {
      console.error("Erro ao inserir notificação:", data.error);
      return null; // Retorna null em caso de erro
    }
  } catch (error) {
    console.error("Erro ao inserir notificação:", error);
    return null; // Retorna null em caso de erro
  }
};
