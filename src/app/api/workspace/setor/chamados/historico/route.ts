import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import {
  listaHistoricoChamado,
  inserirHistoricoChamado,
} from "../../../../../../../controllers/Chamados/historico/chamadoHistoricoController";

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get("data");

  if (!data) {
    return NextResponse.json(
      { error: "Parâmetro 'data' ausente" },
      { status: 400 }
    );
  }

  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

  // Descriptografar os dados recebidos
  const bytes = CryptoJS.AES.decrypt(
    decodeURIComponent(String(data)),
    secretKey
  );

  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const idChamado = Number(decryptedData);

  try {
    const historico = await listaHistoricoChamado(idChamado);
    return NextResponse.json(historico, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ocorreu um erro ao obter o historico do chamado em API." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: "Parâmetro 'data' ausente" },
        { status: 400 }
      );
    }

    const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);
    const bytes = CryptoJS.AES.decrypt(data, secretKey);

    try {
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const chamadoId = Number(decryptedData.chamadoId);
      const alteradoPorId = Number(decryptedData.alteradoPorId);
      const tipo = decryptedData.tipo;
      const descricao = decryptedData.descricao;
      const valorAnterior = decryptedData.valorAnterior;
      const valorNovo = decryptedData.valorNovo;

      if (
        !chamadoId ||
        !alteradoPorId ||
        !tipo ||
        !descricao 
      ) {
        return NextResponse.json(
          { error: "Dados insuficientes (setorId ou nome ausente)" },
          { status: 400 }
        );
      }

      const historico = await inserirHistoricoChamado(
        chamadoId,
        alteradoPorId,
        tipo,
        descricao,
        valorAnterior,
        valorNovo
      );

      return NextResponse.json(historico, { status: 200 });
    } catch (error) {
      console.error("Erro ao descriptografar dados:", error);
      return NextResponse.json(
        { error: "Erro na descriptografia dos dados." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar a requisição." },
      { status: 500 }
    );
  }
}
