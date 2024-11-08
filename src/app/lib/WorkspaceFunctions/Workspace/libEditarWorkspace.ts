export const editarWorkspace = async (nome: string, idWorkspace: number, ) => {
    try {
        const response = await fetch("/api/workspace", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome: nome,
              idWorkspace: idWorkspace,
            }),
          });
  
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error("Ocorreu um erro ao editar a workspace:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Ocorreu um erro ao editar a workspace:", error);
      return null;
    }
  };
  