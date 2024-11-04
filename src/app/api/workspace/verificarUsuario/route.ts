import { verificaUsuarioEWorkspace } from "../../../../../controllers/Workspace/workspaceController";
import CryptoJS from "crypto-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Obter e verificar se "data" está presente no corpo da requisição
    const { data } = await request.json();

    if (!data) {
      return NextResponse.json({ error: "Parâmetro 'data' ausente" }, { status: 400 });
    }

    const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

    // Descriptografar os dados recebidos
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(String(data)), secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const userEmail = decryptedData?.email;
    const idWorkspace = Number(decryptedData?.idWorkspace);

    if (!userEmail || !idWorkspace) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const isUserInWorkspace = await verificaUsuarioEWorkspace(userEmail, idWorkspace);

    if (isUserInWorkspace) {
      return NextResponse.json({ belongs: true }, { status: 200 });
    } else {
      return NextResponse.json({ belongs: false }, { status: 403 });
    }

  } catch (error) {
    console.error("Erro ao verificar usuário API:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
