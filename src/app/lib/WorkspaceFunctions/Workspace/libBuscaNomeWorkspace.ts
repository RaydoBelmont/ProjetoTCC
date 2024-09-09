export const buscaNomeWorkspace = async (workspaceId: number) => {
    try {
        const response = await fetch(`/api/workspace?idWorkspace=${workspaceId}`);
        const data = await response.json();
        if (response.ok) {
          return(data);
        } else {
          console.error('Erro ao buscar nome Workspace:', data.error);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };
