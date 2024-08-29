import { buscarWorkspacePorEmaileNome, handleSaveWorkspace, listarWorkspacesPorUser, verificaAdm } from "../../../../controllers/Workspace/workspaceController";
import { NextRequest, NextResponse } from "next/server";
// import { authOpcoes } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {

  // const session = await getServerSession(authOpcoes);
  // if (!session) {
  //   return new NextResponse("Requisição não autorizada!", { status: 401 });
  // }


    if (request.method === 'POST') {
      const data = await request.json();
      const nome = data.nome;
      const userEmail = data.email
  
      try {
        const newWorkspace = await handleSaveWorkspace(nome, userEmail);
        console.log(newWorkspace)
        return NextResponse.json(newWorkspace, {status: 200});
      } catch (error) {
         return NextResponse.json({ error: 'Ocorreu um erro ao criar a workspace.' }, {status: 500});
      }
    } else {
      return NextResponse.json({ error: 'Method not allowed.' }, {status: 405});
    }
  }

  export async function GET(request: NextRequest) {

    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new NextResponse("Requisição não autorizada!", { status: 401 });
    // }
  
    if (request.method === 'GET') {
      const userEmail  = request.nextUrl.searchParams.get("email") 
      const buscaPorNome  = request.nextUrl.searchParams.get("nomeWorkspace")
      const idWorkspace = request.nextUrl.searchParams.get("idWorkspace")

      if(userEmail && buscaPorNome && !idWorkspace){
        try {
          console.log(userEmail, buscaPorNome)
          const workspaces = await buscarWorkspacePorEmaileNome(userEmail,buscaPorNome );
          return NextResponse.json(workspaces, { status: 200 });
        } catch (error) {
          
        }
      }else if(userEmail && !buscaPorNome && !idWorkspace){
      try {
        const workspaces = await listarWorkspacesPorUser(userEmail);
        return NextResponse.json(workspaces, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Ocorreu um erro ao obter as workspaces do usuário.' }, { status: 500 });
      }
    }else if(userEmail && idWorkspace && !buscaPorNome ){
      try {
        const isAdmin = await verificaAdm(userEmail, idWorkspace);
        return NextResponse.json(isAdmin, { status: 200 });
      } catch (error) {
        
      }
    }
     else {
      return NextResponse.json({ error: 'Método não permitido.' }, { status: 405 });
    }
  }
}