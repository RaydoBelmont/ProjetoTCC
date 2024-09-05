export const buscaIdUserPorEmail = async (email: string) => {
    try {
      const response = await fetch("/api/users?email=" + email);
      const data = await response.json();
      if (data && Number.isInteger(data)) {
        return data;
      } else {
        return false
      }
    } catch (error) {
      console.error("Erro ao carregar o usuario:", error);
    }
  };

  export const buscaUsuarioAdmin = async (email: string, idWorkspace: string | number) => {

    try {
      const response = await fetch("/api/workspace?email=" + email + "&idWorkspace=" + idWorkspace)
      const data = await response.json();
      if(data && typeof data.isAdmin === "boolean"){
        return data.isAdmin
      } else {
        console.error("Erro: data.Admin é undefined ou não é um array");
      }
    } catch (error) {
      console.error("Erro ao carregar o admin do usuario:", error);
    }
  }