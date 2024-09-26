import CryptoJS from "crypto-js";

export const inserirChamado = async (clienteId: number, 
    titulo: string,
    descricao: string,
    statusId: number,
    prioridadeId: number,
    membroId: number,
    quadroId: number,
    workspaceId: number,) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({
        clienteId, 
        titulo,
        descricao,
        statusId,
        prioridadeId,
        membroId,
        quadroId,
        workspaceId}),
    secretKey
  ).toString();

  try {
    const response = await fetch("/api/workspace/setor/chamados", {
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
      console.error("Erro ao inserir chamado:", data.error);
      return null;
    }
  } catch (error) {
    console.error('Erro ao inserir chamado:', error);
      return null;
  }
};
