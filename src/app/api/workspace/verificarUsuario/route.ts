import { verificaUsuarioEWorkspace } from "../../../../../controllers/Workspace/workspaceController";
import CryptoJS from "crypto-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Obter e verificar se "data" está presente nos parâmetros de consulta
    const data = request.nextUrl.searchParams.get("data");
    
    if (!data) {
      return NextResponse.json({ error: "Parâmetro 'data' ausente" }, { status: 400 });
    }

    const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

    // Descriptografar os dados recebidos
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(String(data)), secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const userEmail = decryptedData?.email;
    const idWorkspace = Number(decryptedData?.idWorkspace);

    // Verificar se os dados descriptografados são válidos
    if (!userEmail || !idWorkspace) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Chamar a função de verificação
    const isUserInWorkspace = await verificaUsuarioEWorkspace(userEmail, idWorkspace);

    // Retornar a resposta apropriada
    if (isUserInWorkspace) {
      return NextResponse.json({ belongs: true }, { status: 200 });
    } else {
      return NextResponse.json({ belongs: false }, { status: 403 });
    }

  } catch (error) {
    // Log do erro e resposta genérica
    console.error("Erro ao verificar usuário API:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
