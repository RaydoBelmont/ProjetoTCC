import CryptoJS from "crypto-js";

export const verificaUsuarioComWorkspace = async (email: string, workspaceId: number) => {
  const emailWorkspace = {
    email: email,
    idWorkspace: workspaceId,
  };

  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(emailWorkspace),
    secretKey
  ).toString();

  try {
    const response = await fetch(`/api/workspace/verificarUsuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: encryptedData }),
    });

    // Tratamento de erro baseado no status HTTP
    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 403) {
      throw new Error("Forbidden: o usuário não tem permissão para acessar esta workspace.");
    } else {
      throw new Error("Erro ao verificar o usuário.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error; // Propaga o erro para ser tratado no frontend
  }
};
