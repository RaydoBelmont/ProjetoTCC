import CryptoJS from "crypto-js";

export const inserirMembro = async (  idChamado: number,
    idNovoMembro: number
) => {
  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({idChamado,
        idNovoMembro
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
      console.error("Erro ao inserir membro no chamado:", data.error);
      return null;
    }
  } catch (error) {
    console.error('Erro ao inserir membro no chamado:', error);
      return null;
  }
};

export const removeMembro = async (  idChamado: number,
  idMembroRemover: number
) => {
const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
const encryptedData = CryptoJS.AES.encrypt(
  JSON.stringify({idChamado,
    idMembroRemover
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
    console.error("Erro ao inserir membro no chamado:", data.error);
    return null;
  }
} catch (error) {
  console.error('Erro ao inserir membro no chamado:', error);
    return null;
}
};
