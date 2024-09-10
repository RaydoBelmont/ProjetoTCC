import CryptoJS from "crypto-js";

export const buscarQuadros = async (workspaceId: number) => {

    const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(workspaceId),
      secretKey
    ).toString();
  
    try {
      const response = await fetch(`/api/workspace/setor/quadro?data=${encodeURIComponent(encryptedData)}`);
      
      // Tratamento de erro baseado no status HTTP
      if (response.ok) {
        const data = await response.json();
        return data;
      
      } else {
        throw new Error("Erro ao buscar o Quadros em Lib.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  };
  