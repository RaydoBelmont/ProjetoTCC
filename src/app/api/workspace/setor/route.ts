import { NextRequest, NextResponse } from "next/server";
import {
  novoSetor,
  listarSetores,
  editarSetor,
} from "../../../../../controllers/Setores/setorController";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {

    const workspaceId = Number(request.nextUrl.searchParams.get("idWorkspace"))

    try {
      const listaSetor = await listarSetores(workspaceId)
      return NextResponse.json(listaSetor, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Ocorreu um erro ao obter os setores em API.' }, { status: 500 });
    }

  }
}


export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const data = await request.json();
    const workspaceId = Number(data.workspaceId);
    const nomeSetor = data.nome;

    try {
      const newSetor = await novoSetor(workspaceId, nomeSetor);
      return NextResponse.json(newSetor, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Erro ao tentar criar um novo setor em API" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
  }
}

export async function PATCH(request: NextRequest) {
  if (request.method === "PATCH") {
    const data = await request.json();
    const setorId = Number(data.setorId);
    const nomeSetor = data.nome;

    try {
      const setor = await editarSetor(setorId, nomeSetor);
      return NextResponse.json(setor, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Erro ao tentar editar setor em API" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
  }
}
