import CryptoJS from "crypto-js";

export const listaChamados = async (quadroId: number) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({ quadroId: quadroId}),
    secretKey
  ).toString();

  try {
    const response = await fetch(
      `/api/workspace/setor/chamados?data=${encodeURIComponent(
        encryptedData
      )}`
    );
    const data = await response.json();
    if (data && Array.isArray(data)) {
      return data;
    } else {
      console.error("Erro: data.chamados é undefined ou não é um array");
    }
  } catch (error) {
    console.error("Erro ao carregar chamados:", error);
  }
};

export const buscaChamado = async (chamadoId: number) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

  // Combine os dois parâmetros em um único objeto
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({ chamadoId: chamadoId}),
    secretKey
  ).toString();

  try {
    const response = await fetch(
      `/api/workspace/setor/chamados?data=${encodeURIComponent(
        encryptedData
      )}`
    );
    const data = await response.json();
    if (data) {
      return data;
    } else {
      console.error("Erro: data.chamados é undefined ou não é um array");
    }
  } catch (error) {
    console.error("Erro ao carregar chamado:", error);
  }
};