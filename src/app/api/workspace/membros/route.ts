import { NextRequest, NextResponse } from "next/server";
import {
  listarMembrosWorkspace,
  getMembroWorkspace,
  setarAdmin,
  insereMembroNaWorkspace
} from "../../../../../controllers/Workspace/MembrosWorkspace/membrosController";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const workspaceId = Number(request.nextUrl.searchParams.get("workspaceId"));
    const userId = Number(request.nextUrl.searchParams.get("userId"));

    if (workspaceId && !userId) {
      try {
        const listaDeMembros = await listarMembrosWorkspace(workspaceId);
        return NextResponse.json(listaDeMembros, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Erro ao tentar buscar por Membros da Workspace na API." },
          { status: 500 }
        );
      }
    }else if(workspaceId && userId){
      try {
        const userWorkspaceExiste = await getMembroWorkspace(workspaceId, userId);
        return NextResponse.json(userWorkspaceExiste, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Erro ao tentar buscar por Membros da Workspace na API." },
          { status: 500 }
        );
      }
    }
  }
}

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const data = await request.json();
    const userId = Number(data.userId);
    const workspaceId = Number(data.workspaceId);

 

    if (userId && workspaceId) {
      try {
        const membroWorkspace = await insereMembroNaWorkspace(userId,workspaceId);
        return NextResponse.json(membroWorkspace, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar inserir um Membro na Workspace em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar inserir um Membro na Workspace em API" },
          { status: 500 }
        );
      }
    }
  } else {
    return NextResponse.json(
      { error: "Método não permitido em API." },
      { status: 405 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (request.method === "PATCH") {
    const idUser = Number(request.nextUrl.searchParams.get("idUser"));
    const idWorkspace = Number(request.nextUrl.searchParams.get("idWorkspace"));
    const isAdmin = (request.nextUrl.searchParams.get("isAdmin"));
    const isAdminBool = (isAdmin === 'true' ? true : false);
 

    if (idUser && idWorkspace) {
      try {
        const userUpdate = await setarAdmin(idWorkspace, idUser, isAdminBool);
        return NextResponse.json(userUpdate, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar setar um User em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar setar um User em API" },
          { status: 500 }
        );
      }
    }
  } else {
    return NextResponse.json(
      { error: "Método não permitido em API." },
      { status: 405 }
    );
  }
}
