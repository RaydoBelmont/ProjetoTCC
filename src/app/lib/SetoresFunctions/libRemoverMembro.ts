export const removerMembro = async (setorId: number, idUser: number) => {
    try {
      const response = await fetch("/api/workspace/setor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setorId: setorId,
          idUser: idUser,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error("Erro ao remover membro no Setor:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Erro ao remover membro no Setor:", error);
      return null;
    }
  };
  