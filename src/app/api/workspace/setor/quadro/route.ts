import {listarQuadros,savarQuadro,editQuadro} from "../../../../../../controllers/Quadros/quadrosController"
import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function GET(request: NextRequest) {
    if (request.method === "GET") {

    const data = request.nextUrl.searchParams.get("data");

    if (!data) {
        return NextResponse.json({ error: "Parâmetro 'data' ausente" }, { status: 400 });
      }

      const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

      // Descriptografar os dados recebidos
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(String(data)), secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const idSetor = Number(decryptedData)
  
      try {
        const listaQuadros = await listarQuadros(idSetor)
        return NextResponse.json(listaQuadros, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: 'Ocorreu um erro ao obter os Quadros em API.' }, { status: 500 });
      }
  
    }
  }

  export async function POST(request: NextRequest) {
    if (request.method === "POST") {
      const data = await request.json();

      if (!data) {
        return NextResponse.json({ error: "Parâmetro 'data' ausente" }, { status: 400 });
      }

     const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

      // Descriptografar os dados recebidos
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(String(data)), secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const idSetor = decryptedData.idSetor
      const nomeSetor = decryptedData.nome
      try {
        const novoQuadro = await savarQuadro(nomeSetor, idSetor);
        return NextResponse.json(novoQuadro, { status: 200 });
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Erro ao tentar criar um novo Quadro em API" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
    }
  }
  

  export async function PATCH(request: NextRequest) {
    if (request.method === "PATCH") {
    const data = await request.json();

    if (!data) {
      return NextResponse.json({ error: "Parâmetro 'data' ausente" }, { status: 400 });
    }

   const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

    // Descriptografar os dados recebidos
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(String(data)), secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const quadroId = decryptedData.quadroId
    const nomeSetor = decryptedData.nome
  
      try {
        const quadroEditado = await editQuadro(nomeSetor, nomeSetor);
        return NextResponse.json(quadroEditado, { status: 200 });
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Erro ao tentar editar Quadro em API" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
    }
}