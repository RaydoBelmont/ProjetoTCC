import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import {buscarPorUser} from "../../../../controllers/user/userController"
// import { GET } from "@/app/api/auth/[...nextauth]/route"; // Certifique-se de que o caminho está correto

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