import { handleSaveWorkspace, listarWorkspacesPorUser } from "../../../../controllers/workspaceController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {
      const data = await request.json();
      const nome = data.nome;
      const userEmail = data.email
  
      try {
        const newWorkspace = await handleSaveWorkspace(nome, userEmail);
        return NextResponse.json({newWorkspace}, {status: 200});
      } catch (error) {
         return NextResponse.json({ error: 'Ocorreu um erro ao criar a workspace.' }, {status: 500});
      }
    } else {
      return NextResponse.json({ error: 'Method not allowed.' }, {status: 405});
    }
  }

  export async function GET(request: NextRequest) {
    if (request.method === 'GET') {
      const userEmail  = request.nextUrl.searchParams.get("email")
      if(userEmail)
      try {
        const workspaces = await listarWorkspacesPorUser(userEmail);
        return NextResponse.json(workspaces, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Ocorreu um erro ao obter as workspaces do usuário.' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Método não permitido.' }, { status: 405 });
    }
  }
  