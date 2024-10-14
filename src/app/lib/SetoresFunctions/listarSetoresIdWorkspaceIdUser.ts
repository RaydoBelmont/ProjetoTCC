export const listaSetores = async (idWorkspace: number, idUser: number) => {
  try {
    const response = await fetch(
      "/api/workspace/setor?idWorkspace=" + idWorkspace + "&" + "idUser=" + idUser
    );
    const data = await response.json();
    if (data && Array.isArray(data)) {
      return data;
    } else {
      console.error("Erro: data.setores é undefined ou não é um array");
    }
  } catch (error) {
    console.error("Erro ao carregar os setores:", error);
  }
};

export const buscaSetor = async (idSetor: number) => {
  try {
    const response = await fetch("/api/workspace/setor?idSetor=" + idSetor);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao carregar os setores:", error);
  }
};
