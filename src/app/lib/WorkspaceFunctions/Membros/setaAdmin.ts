export const libSetarAdmin = async (
  idUser: number,
  idWorkspace: number,
  isAdmin: boolean
) => {
  try {
    const response = await fetch(
      `/api/workspace/membros?idUser=${idUser}&idWorkspace=${idWorkspace}&isAdmin=${isAdmin}`,
      {
        method: "PATCH",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Erro ao ativar Cliente:", data.error);
    }
  } catch (error) {
    console.error("Erro ao ativar Cliente:", error);
  }
};
