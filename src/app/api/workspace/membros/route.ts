import { NextRequest, NextResponse } from "next/server";
import { listarMembrosWorkspace } from "../../../../../controllers/Workspace/MembrosWorkspace/buscaMembroWorkspace";

export async function GET(request: NextRequest) {
    if (request.method === "GET") {
  
      const workspaceId = Number(request.nextUrl.searchParams.get("workspaceId"))

      try {
        const listaDeMembros = await listarMembrosWorkspace(workspaceId)
        return NextResponse.json(listaDeMembros, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Erro ao tentar buscar por Membros da Workspace na API.' }, { status: 500 });
      }
  
    }
  }
  