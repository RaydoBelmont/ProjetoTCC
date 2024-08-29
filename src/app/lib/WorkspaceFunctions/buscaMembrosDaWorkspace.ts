export const buscaMembrosWorkspace = async (workspaceId: number) => {
    try {
        const response = await fetch(`/api/workspace/membros?workspaceId=${workspaceId}`);
        const data = await response.json();
        if (response.ok) {
          return(data);
        } else {
          console.error('Erro ao buscar membros:', data.error);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };
