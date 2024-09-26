import CryptoJS from "crypto-js";

export const inserirPrioridade = async (setorId: number, nome: string) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({ setorId, nome }),
    secretKey
  ).toString();

  try {
    const response = await fetch("/api/workspace/setor/prioridade", {
      method: "POST",
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
      console.error("Erro ao inserir Prioridade:", data.error);
      return null;
    }
  } catch (error) {
    console.error('Erro ao inserir Prioridade:', error);
      return null;
  }
};
