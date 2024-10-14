import { NextRequest, NextResponse } from "next/server";
import {
  novoSetor,
  listarSetores,
  editaNomeSetor,
  buscaSetor,
  inserirMembro,
  removerMembro
} from "../../../../../controllers/Setores/setorController";

export async function GET(request: NextRequest) {


    const workspaceId = Number(request.nextUrl.searchParams.get("idWorkspace"))
    const idUser = Number(request.nextUrl.searchParams.get("idUser"))
    const idSetor = Number(request.nextUrl.searchParams.get("idSetor"))

    if(workspaceId && idUser){
      try {
        const listaSetor = await listarSetores(workspaceId, idUser)
        return NextResponse.json(listaSetor, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Ocorreu um erro ao obter os setores em API.' }, { status: 500 });
      }
    }

    if(idSetor && !workspaceId && !idUser) {
      try {
        const setor = await buscaSetor(idSetor)
        return NextResponse.json(setor, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Ocorreu um erro ao obter o setor em API.' }, { status: 500 });
      }
    }


}


export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const data = await request.json();
    const workspaceId = Number(data.workspaceId);
    const nomeSetor = data.nome;
    const idUser = data.idUser;

    try {
      const newSetor = await novoSetor(workspaceId, nomeSetor, idUser);
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
    const data = await request.json();
    const setorId = Number(data.setorId);
    const idUser = Number(data.idUser);
    const nomeSetor = data.nome;

    try {

      if(setorId && nomeSetor && !idUser) {
        const setor = await editaNomeSetor(setorId, nomeSetor);
        return NextResponse.json(setor, { status: 200 });
      }

      if(idUser && setorId && !nomeSetor) {
        const result = await inserirMembro(setorId, idUser)
        return NextResponse.json(result, { status: 200 });
      }

    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Erro ao tentar editar setor em API" },
        { status: 500 }
      );
    }
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  const setorId = Number(data.setorId);
  const idUser = Number(data.idUser);

  try {
    if(setorId && idUser) {
      const result = await removerMembro(setorId, idUser)
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao tentar remover membro do setor em API" },
      { status: 500 }
    );
  }
}