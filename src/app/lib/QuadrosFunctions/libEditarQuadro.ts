import CryptoJS from "crypto-js";

export const editarQuadro = async (quadroId: number, nome: string) => {

    const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({quadroId: quadroId, nome: nome}),
      secretKey
    ).toString();

    try {
      const response = await fetch("/api/workspace/setor/quadro", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data: encryptedData
          }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.error("Erro ao editar Quadro:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Erro ao editar Quadro:", error);
      return null;
    }
  };
  