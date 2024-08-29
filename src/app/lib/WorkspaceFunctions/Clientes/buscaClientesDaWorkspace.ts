export const buscarClientes = async (workspaceId: number) => {
    try {
      const response = await fetch(`/api/workspace/clientes?idWorkspace=${workspaceId}`);
      const data = await response.json();
      if (response.ok) {
          return (data);
      }else{
        console.error('Erro ao buscar Clientes:', data.error);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };