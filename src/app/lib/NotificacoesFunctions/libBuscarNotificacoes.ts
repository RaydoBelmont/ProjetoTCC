export const buscarNotificacoesDoUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/notificacoes?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
          return (data);
      }else{
        console.error('Erro ao buscar Notificacoes:', data.error);
      }
    } catch (error) {
      console.error("Erro ao buscar Notificacoes:", error);
    }
  };