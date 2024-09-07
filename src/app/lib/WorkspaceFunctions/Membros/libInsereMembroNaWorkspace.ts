export const inserirMembroNaWorkspace = async (
    idUser: number,
    idWorkspace: number,
  ) => {
    try {
      const response = await fetch("/api/workspace/membros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: idUser,
          workspaceId: idWorkspace,
        }),
      });
      
      const data = await response.json();
  
      if (response.ok) {
        return data; // Retorna os dados da resposta em caso de sucesso
      } else {
        console.error("Erro ao inserir novo Membro na Workspace:", data.error);
        return null; // Retorna null em caso de erro
      }
    } catch (error) {
      console.error("Erro ao inserir novo Membro na Workspace:", error);
      return null; // Retorna null em caso de erro
    }
  };
  