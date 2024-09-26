import CryptoJS from "crypto-js";

export const listaPrioridades = async (setorId: number) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(setorId),
    secretKey
  ).toString();

  try {
    const response = await fetch(
      `/api/workspace/setor/prioridade?data=${encodeURIComponent(
        encryptedData
      )}`
    );
    const data = await response.json();
    if (data && Array.isArray(data)) {
      return data;
    } else {
      console.error("Erro: data.status é undefined ou não é um array");
    }
  } catch (error) {
    console.error("Erro ao carregar as prioridades:", error);
  }
};
