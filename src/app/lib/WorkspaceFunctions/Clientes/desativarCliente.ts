export const libDesativarCliente = async (idCliente: number) => {
    try {
      const response = await fetch(`/api/workspace/clientes?idCliente=${idCliente}`, {
        method: 'DELETE',
      })
      const data = await response.json();
      if (response.ok) {
          return (data);
      }else{
        console.error('Erro ao desativar Cliente:', data.error);
      }
    } catch (error) {
      console.error("Erro ao desativar Cliente:", error);
    }
  };