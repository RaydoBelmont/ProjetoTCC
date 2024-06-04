import {
  savarQuadro,
  listarQuadros,
} from "../../../../controllers/quadrosController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const data = await request.json();
    const nome = data.nome;
    const workspaceId = data.idWorkspace;
    try {
      const novoQuadro = await savarQuadro(nome, workspaceId);
      return NextResponse.json({ novoQuadro }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao criar o quadro." },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
  }
}

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const workspaceId = request.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId é necessário" },
        { status: 400 }
      );
    }

    try {
      const quadros = await listarQuadros(workspaceId);
      return NextResponse.json(quadros, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao obter os quadros." },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Método não permitido." },
      { status: 405 }
    );
  }
}
