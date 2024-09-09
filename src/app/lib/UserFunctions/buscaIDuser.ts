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
  
  export async function buscaUsuarioAdmin(email: string, idWorkspace: number) {
    try {
      const response = await fetch(`/api/workspace?email=${email}&idWorkspace=${idWorkspace}`);
      
      if (!response.ok) {
        console.error('Erro ao carregar o admin do usuario:', response.statusText);
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar Admin:', error);
      return null;
    }
  }
  