export const editarSetor = async (setorId: number, nome: string) => {
  try {
    const response = await fetch("/api/workspace/setor", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        setorId: setorId,
        nome: nome,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Erro ao editar Setor:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Erro ao editar Setor:", error);
    return null;
  }
};
