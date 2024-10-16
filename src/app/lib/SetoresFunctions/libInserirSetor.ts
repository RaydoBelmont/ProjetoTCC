export const inserirSetor = async (workspaceId: number, nome: string, idUser: number) => {
  try {
    const response = await fetch("/api/workspace/setor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceId: workspaceId,
        nome: nome,
        idUser: idUser
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Erro ao inserir Setor:", data.error);
      return null;
    }
  } catch (error) {
    console.error('Erro ao inserir Setor:', error);
      return null;
  }
};
