import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import {
  listaChamadosPorQuadro,
  insereChamado,
} from "../../../../../../controllers/Chamados/chamadosController";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const data = request.nextUrl.searchParams.get("data");

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
    const idQuadro = Number(decryptedData);

    try {
      const listaDeChamadosPorQuadro = await listaChamadosPorQuadro(idQuadro);
      return NextResponse.json(listaDeChamadosPorQuadro, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao obter os chamados em API." },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  const { data } = await request.json();

  if (!data) {
    return NextResponse.json(
      { error: "Parâmetro 'data' ausente" },
      { status: 400 }
    );
  }

  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

  // Descriptografar os dados recebidos
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


  const clienteId = Number(decryptedData.clienteId);
  const titulo = decryptedData.titulo;
  const descricao = decryptedData.descricao;
  const statusId = Number(decryptedData.statusId);
  const prioridadeId = Number(decryptedData.prioridadeId);
  const membroId = Number(decryptedData.membroId);
  const quadroId = Number(decryptedData.quadroId);
  const workspaceId = Number(decryptedData.workspaceId);

  if (
    !clienteId ||
    !titulo ||
    !descricao ||
    !statusId ||
    !prioridadeId ||
    !membroId ||
    !quadroId ||
    !workspaceId
  ) {
    return NextResponse.json(
      { error: "Dados insuficientes (setorId ou nome ausente)" },
      { status: 400 }
    );
  }

  try {
    const chamado = await insereChamado(clienteId, titulo, descricao, statusId, prioridadeId, membroId, quadroId, workspaceId);
    return NextResponse.json(chamado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ocorreu um erro ao inserir chamado em API." },
      { status: 500 }
    );
  }
}
