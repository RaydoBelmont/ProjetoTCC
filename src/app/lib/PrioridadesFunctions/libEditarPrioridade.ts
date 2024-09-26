import CryptoJS from "crypto-js";

export const editarPrioridade = async (prioridadeId: number, nome: string) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({ prioridadeId, nome }),
    secretKey
  ).toString();

  try {
    const response = await fetch("/api/workspace/setor/prioridade", {
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
      console.error("Erro ao editar Status:", data.error);
      return null;
    }
  } catch (error) {
    console.error('Erro ao editar Status:', error);
      return null;
  }
};
