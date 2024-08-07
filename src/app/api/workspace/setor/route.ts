import { NextRequest, NextResponse } from "next/server";
import {
  novoSetor,
  listarSetoresPorUser,
} from "../../../../../controllers/setorController";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const data = await request.json();
    const workspaceId = Number(data.workspaceId);
    const nomeSetor = data.nomeSetor;
    const userId = Number(data.userId);

    try {
      const newSetor = await novoSetor(workspaceId, nomeSetor, userId);
      console.log(newSetor);
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

export async function GET(request: NextRequest) {
  if (request.method === "GET") {

    const workspaceId = Number(request.nextUrl.searchParams.get("idWorkspace"))
    const idUser = Number(request.nextUrl.searchParams.get("idUser"))

    try {
      const listaSetor = await listarSetoresPorUser(workspaceId, idUser)
      return NextResponse.json(listaSetor, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Ocorreu um erro ao obter os setores por usuário. EM ROUTE SETOR' + 'idWorkspace:' + idUser }, { status: 500 });
    }

  }
}
