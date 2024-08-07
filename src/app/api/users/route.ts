import { NextRequest, NextResponse } from "next/server";
import {buscarPorUser} from "../../../../controllers/user/userController"

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

if (email !== null) {
    const idUser = await buscarPorUser(email)
    return NextResponse.json(idUser, { status: 200 });
  } 
}