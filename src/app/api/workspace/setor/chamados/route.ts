import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import {
  listaChamadosPorQuadro,
  insereChamado,
  alteraChamado,
  insereMembro,
  removeMembro,
  buscarChamado,
  transfereChamado
} from "../../../../../../controllers/Chamados/chamadosController";

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const data = request.nextUrl.searchParams.get("data");

    if (!data) {
      return NextResponse.json(
        { error: "Parâmetro 'data' ausente" },
        { status: 400 }
      );
    }

    const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

    // Descriptografar os dados recebidos
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { quadroId, chamadoId } = decryptedData;

    if (quadroId && !chamadoId) {
      try {
        const listaDeChamadosPorQuadro = await listaChamadosPorQuadro(quadroId);
        return NextResponse.json(listaDeChamadosPorQuadro, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Ocorreu um erro ao obter os chamados em API." },
          { status: 500 }
        );
      }
    } else if (chamadoId && !quadroId) {
      try {
        const chamado = await buscarChamado(chamadoId);
        return NextResponse.json(chamado, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Ocorreu um erro ao obter um chamado em API." },
          { status: 500 }
        );
      }
    }
  }
}

export async function POST(request: NextRequest) {
  const { data } = await request.json();

  if (!data) {
    return NextResponse.json(
      { error: "Parâmetro 'data' ausente" },
      { status: 400 }
    );
  }

  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

  // Descriptografar os dados recebidos
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  const clienteId = Number(decryptedData.clienteId);
  const titulo = decryptedData.titulo;
  const descricao = decryptedData.descricao;
  const statusId = Number(decryptedData.statusId);
  const prioridadeId = Number(decryptedData.prioridadeId);
  const membroId = Number(decryptedData.membroId);
  const quadroId = Number(decryptedData.quadroId);
  const workspaceId = Number(decryptedData.workspaceId);

  if (
    !clienteId ||
    !titulo ||
    !descricao ||
    !statusId ||
    !prioridadeId ||
    !membroId ||
    !quadroId ||
    !workspaceId
  ) {
    return NextResponse.json(
      { error: "Dados insuficientes (setorId ou nome ausente)" },
      { status: 400 }
    );
  }

  try {
    const chamado = await insereChamado(
      clienteId,
      titulo,
      descricao,
      statusId,
      prioridadeId,
      membroId,
      quadroId,
      workspaceId
    );
    return NextResponse.json(chamado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ocorreu um erro ao inserir chamado em API." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { data } = await request.json();

  if (!data) {
    return NextResponse.json(
      { error: "Parâmetro 'data' ausente" },
      { status: 400 }
    );
  }

  const secretKey = String(process.env.NEXT_PUBLIC_CHAVE_CRIPTO);

  // Descriptografar os dados recebidos
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  const idChamado = Number(decryptedData.idChamado);
  const idNovoStatus = Number(decryptedData.idNovoStatus);
  const idNovaPrioridade = Number(decryptedData.idNovaPrioridade);
  const novaDescricao = decryptedData.novaDescricao;
  const idNovoCliente = Number(decryptedData.idNovoCliente);
  const idNovoMembro = Number(decryptedData.idNovoMembro);
  const idMembroRemover = Number(decryptedData.idMembroRemover);
  const idQuadroTransferir = Number(decryptedData.idQuadroTransferir);

  if (!idChamado) {
    return NextResponse.json(
      { error: "Dados insuficientes (ID CHAMADO)" },
      { status: 400 }
    );
  }

  if (idNovoStatus || idNovaPrioridade || novaDescricao || idNovoCliente) {
    try {
      const chamadoAlterado = await alteraChamado(
        idChamado,
        idNovoStatus,
        idNovaPrioridade,
        novaDescricao,
        idNovoCliente
      );
      return NextResponse.json(chamadoAlterado, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao inserir chamado em API." },
        { status: 500 }
      );
    }
  } else if (idNovoMembro || idMembroRemover) {
    if (idNovoMembro) {
      try {
        const membroInserido = await insereMembro(idChamado, idNovoMembro);
        return NextResponse.json(membroInserido, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Ocorreu um erro ao inserir chamado em API." },
          { status: 500 }
        );
      }
    } else {
      try {
        const membroRemovido = await removeMembro(idChamado, idMembroRemover);
        return NextResponse.json(membroRemovido, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Ocorreu um erro ao remover chamado em API." },
          { status: 500 }
        );
      }
    }
  } else if (idQuadroTransferir){
    try {
      const transferido = await transfereChamado(idChamado,idQuadroTransferir )
      if(transferido === true){
        return NextResponse.json(true, { status: 200 });
      }else{
        return NextResponse.json(false, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao transferir chamado em API." },
        { status: 500 }
      );
    }
  }
}
