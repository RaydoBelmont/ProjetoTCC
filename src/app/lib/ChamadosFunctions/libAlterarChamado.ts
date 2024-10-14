import CryptoJS from "crypto-js";
const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

export const updateChamado = async (  idChamado: number,
    idNovoStatus?: number,
    idNovaPrioridade?: number,
    novaDescricao?: string,
    idNovoCliente?: number,
    idNovoMembro?: number,
    idMembroRemover?: number) => {
  
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({idChamado,
        idNovoStatus,
        idNovaPrioridade,
        novaDescricao,
        idNovoCliente,
        idNovoMembro,
        idMembroRemover,
        }),
    secretKey
  ).toString();

  try {
    const response = await fetch("/api/workspace/setor/chamados", {
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
      console.error("Erro ao inserir chamado:", data.error);
      return null;
    }
  } catch (error) {
    console.error('Erro ao inserir chamado:', error);
      return null;
  }
};

export const transferirChamado = async (
  idChamado: number, 
  idQuadroTransferir: number
) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({ idChamado, idQuadroTransferir }),
    secretKey
  ).toString();

  try {
    const response = await fetch("/api/workspace/setor/chamados", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: encryptedData }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data === true) {
        return true;
      } else {
        return false;
      }
    } else {
      console.error("Erro na resposta da API:", data.error);
      return false;
    }
  } catch (error) {
    console.error("Erro ao inserir chamado:", error);
    return false;
  }
};
