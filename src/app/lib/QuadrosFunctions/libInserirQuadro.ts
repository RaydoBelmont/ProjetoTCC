import CryptoJS from "crypto-js";


export const inserirQuadro = async (setorId: number, nome: string, idUser: number) => {

  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({idSetor: setorId, nome: nome, idUser: idUser}),
    secretKey
  ).toString();

  try {
    const response = await fetch("/api/workspace/setor/quadro", {
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
      console.error("Erro ao inserir Quadro:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Erro ao inserir Quadro:", error);
    return null;
  }
};
