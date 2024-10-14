import { NextRequest, NextResponse } from "next/server";
import {
  novoCliente,
  listarClientesPorWorkspace,
  updateCliente,
  desativaCliente,
  ativaCliente,
} from "../../../../../controllers/Workspace/Clientes/clientesController";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
  }

  try {
    const data = await request.json();

    // Validação dos campos obrigatórios
    const workspaceId = Number(data.workspaceId);
    const nome = data.nome;
    const cpfCnpj = data.cpfCnpj;

    if (!workspaceId || !nome || !cpfCnpj) {
      return NextResponse.json(
        { error: "workspaceId, nome, e cpfCnpj são obrigatórios." },
        { status: 400 }
      );
    }

    // Campos opcionais
    const razao = data.razao;
    const iE = data.iE;
    const email = data.email;
    const observacao = data.observacao;
    const endereco = data.endereco;
    const contatos = data.contatos;

    const cliente = await novoCliente(
      workspaceId,
      nome,
      cpfCnpj,
      razao,
      iE,
      email,
      observacao,
      contatos,
      endereco
    );
    return NextResponse.json(cliente, { status: 200 });
  } catch (error) {
    console.error("Erro ao tentar criar um novo Cliente em API:", error);
    return NextResponse.json(
      { error: "Erro ao tentar criar um novo Cliente em API" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return new NextResponse("Requisição não autorizada!", { status: 401 });
  // }

  if (request.method === "GET") {
    const workspaceId = Number(request.nextUrl.searchParams.get("idWorkspace"));

    if (workspaceId) {
      try {
        const clientes = await listarClientesPorWorkspace(workspaceId);
        return NextResponse.json(clientes, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar buscar um Clientes em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar buscar um Clientes em API" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Método não permitido." },
        { status: 405 }
      );
    }
  }
}

export async function PUT(request: NextRequest) {
  if (request.method === "PUT") {
    const idCliente = Number(request.nextUrl.searchParams.get("idCliente"));
    const data = await request.json();

    // Validação dos campos obrigatórios
    const nome = data.nome;
    const cpfCnpj = data.cpfCnpj;

    if (!idCliente || !nome || !cpfCnpj) {
      return NextResponse.json(
        { error: "ID cliente, nome, e cpfCnpj são obrigatórios." },
        { status: 400 }
      );
    }

    const razao = data.razao;
    const iE = data.iE;
    const email = data.email;
    const observacao = data.observacao;
    const endereco = data.endereco;
    const contatos = data.contatos;

    if (idCliente) {
      try {
        const clienteAtualizado = await updateCliente(
          idCliente,
          nome,
          cpfCnpj,
          razao,
          iE,
          email,
          observacao,
          contatos,
          endereco
        );
        return NextResponse.json(clienteAtualizado, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar atualizar um Cliente em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar atualizar um Cliente em API" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Método não permitido." },
        { status: 405 }
      );
    }
  }
}

export async function DELETE(request: NextRequest){
  if (request.method === "DELETE") {
    const idCliente = Number(request.nextUrl.searchParams.get("idCliente"));

    if(idCliente){
      try {
        const clienteDesativado = await desativaCliente(idCliente);
        return NextResponse.json(clienteDesativado, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar desativar um Cliente em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar desativar um Cliente em API" },
          { status: 500 }
        );
      }
      
    }
  }else {
    return NextResponse.json(
      { error: "Método não permitido em API." },
      { status: 405 }
    );
  }
}

export async function PATCH(request: NextRequest){
  if (request.method === "PATCH") {
    const idCliente = Number(request.nextUrl.searchParams.get("idCliente"));

    if(idCliente){
      try {
        const clienteAtivado = await ativaCliente(idCliente);
        return NextResponse.json(clienteAtivado, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar ativar um Cliente em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar ativar um Cliente em API" },
          { status: 500 }
        );
      }
      
    }
  }else {
    return NextResponse.json(
      { error: "Método não permitido em API." },
      { status: 405 }
    );
  }
}
