import { NextRequest, NextResponse } from "next/server";
import {buscarPorUser} from "../../../../controllers/user/userController"


export async function GET(req: NextRequest) {

  // // Verifica se o usuário está autenticado
  // const session = await getServerSession(authOpcoes);

  // if (!session) {
    
  //   return new NextResponse("Requisição não autorizada!", { status: 401 });
  // }

  const email = req.nextUrl.searchParams.get("email");

if (email !== null) {
    const idUser = await buscarPorUser(email)
    return NextResponse.json(idUser, { status: 200 });
  } 
}