export const libAtivarCliente = async (idCliente: number) => {
    try {
      const response = await fetch(`/api/workspace/clientes?idCliente=${idCliente}`, {
        method: 'PATCH',
      })
      const data = await response.json();
      if (response.ok) {
          return (data);
      }else{
        console.error('Erro ao ativar Cliente:', data.error);
      }
    } catch (error) {
      console.error("Erro ao ativar Cliente:", error);
    }
  };