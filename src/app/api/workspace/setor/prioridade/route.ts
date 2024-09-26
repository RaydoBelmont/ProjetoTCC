import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import {
  listaPrioridades,
  inserePrioridades,
  editaPrioridades,
} from "../../../../../../controllers/Setores/Prioridades/prioridadesController";

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
    const idSetor = Number(decryptedData);

    try {
      const listaDePrioridades = await listaPrioridades(idSetor);
      return NextResponse.json(listaDePrioridades, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao obter as prioridades em API." },
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

  const setorId = Number(decryptedData.setorId);
  const nome = decryptedData.nome;

  if (!setorId || !nome) {
    return NextResponse.json(
      { error: "Dados insuficientes (setorId ou nome ausente)" },
      { status: 400 }
    );
  }

  try {
    const status = await inserePrioridades(setorId, nome);
    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ocorreu um erro ao inserir prioridade em API." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

  const prioridadeId = Number(decryptedData.prioridadeId);
  const nome = decryptedData.nome;

  if (!prioridadeId || !nome) {
    return NextResponse.json(
      { error: "Dados insuficientes (prioridadeId ou nome ausente)" },
      { status: 400 }
    );
  }

  try {
    const status = await editaPrioridades(prioridadeId, nome);
    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ocorreu um erro ao editar status em API." },
      { status: 500 }
    );
  }
}
