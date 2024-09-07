export const inserirNotificacao = async (
    userId: number,
    tipo: string,
    mensagem: string,
    workspaceId?: number ,
    dataExpira?: Date
  ) => {
    try {
      const response = await fetch('/api/notificacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          tipo: tipo,
          mensagem: mensagem,
          idWorkspace: workspaceId || null, // Se workspaceId não for fornecido, envia null
          dataExpira:  dataExpira || null
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return data; // Retorna os dados da resposta em caso de sucesso
      } else {
        console.error('Erro ao inserir notificação:', data.error);
        return null; // Retorna null em caso de erro
      }
    } catch (error) {
      console.error('Erro ao inserir notificação:', error);
      return null; // Retorna null em caso de erro
    }
  };
  