import { NextRequest, NextResponse } from "next/server";
import { getFromDB, postToDB } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const email = req.nextUrl.searchParams.get("email");
  
  if (id !== null) {
    return await getFromDB("user", { id: id });
  } else if (email !== null) {
    return await getFromDB("user", { email: email });
  } else {
    return await getFromDB("user");
  }
}



export async function POST(request: NextRequest) {
  const data = await request.json();
  const columns = Object.keys(data);
  const values = Object.values(data);
  return await postToDB("user", columns, values);
}
