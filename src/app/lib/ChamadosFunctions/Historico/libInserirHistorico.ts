import CryptoJS from "crypto-js";

export const inserirHistorico = async (
  chamadoId: number,
  alteradoPorId: number,
  tipo: string,
  descricao: string,
  valorAnterior: string,
  valorNovo: string
) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({
      chamadoId,
      alteradoPorId,
      tipo,
      descricao,
      valorAnterior,
      valorNovo,
    }),
    secretKey
  ).toString();

  try {
    const response = await fetch("/api/workspace/setor/chamados/historico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptedData,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Erro ao inserir historico chamado:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Erro ao inserir historico chamado:", error);
    return null;
  }
};
