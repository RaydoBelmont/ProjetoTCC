import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import {
  listaChamadosPorQuadro,
  insereChamado,
  alteraChamado,
  insereMembro,
  removeMembro,
  buscarChamado,
  transfereChamado,
  finalizaChamado,
  reabreChamado,
  arquivaChamado,
  desarquivaChamado
} from "../../../../../../controllers/Chamados/chamadosController";
import { StatusEnum } from '@prisma/client'; // importe seu enum de status

const obterStatusEnum = (status: string): StatusEnum | null => {
  if (status in StatusEnum) {
    return status as StatusEnum; // Cast para o tipo StatusEnum
  }
  return null; // Retorna null se não for um valor válido
}

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
  const prioridadeId = Number(decryptedData.prioridadeId);
  const membroId = Number(decryptedData.membroId);
  const quadroId = Number(decryptedData.quadroId);
  const workspaceId = Number(decryptedData.workspaceId);

  if (
    !clienteId ||
    !titulo ||
    !descricao ||
    !prioridadeId ||
    !membroId ||
    !quadroId ||
    !workspaceId
  ) {
    return NextResponse.json(
      { error: "Dados insuficientes (um ou mais campos ausentes)" },
      { status: 400 }
    );
  }



  try {
    const chamado = await insereChamado(
      clienteId,
      titulo,
      descricao,
      prioridadeId,
      membroId,
      quadroId,
      workspaceId
    );
    return NextResponse.json(chamado, { status: 200 });
  } catch (error) {
    console.error("Erro ao inserir chamado:", error); // Log do erro para depuração
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
  const statusString = decryptedData.status;
  const idNovaPrioridade = Number(decryptedData.idNovaPrioridade);
  const novaDescricao = decryptedData.novaDescricao;
  const idNovoCliente = Number(decryptedData.idNovoCliente);
  const idNovoMembro = Number(decryptedData.idNovoMembro);
  const idMembroRemover = Number(decryptedData.idMembroRemover);
  const idQuadroTransferir = Number(decryptedData.idQuadroTransferir);
  const solucao = decryptedData.solucao;
  const reabrir = Boolean(decryptedData.reabrir);
  const arquivaDesarquiva = String(decryptedData.arquivaDesarquiva)
  

  if (!idChamado) {
    return NextResponse.json(
      { error: "Dados insuficientes (ID CHAMADO)" },
      { status: 400 }
    );
  }



  if (statusString || idNovaPrioridade || novaDescricao || idNovoCliente) {
    try {
      const status = obterStatusEnum(statusString);
      const chamadoAlterado = await alteraChamado(
        idChamado,
        status,
        idNovaPrioridade,
        novaDescricao,
        idNovoCliente
      );
      return NextResponse.json(chamadoAlterado, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao inserir chamado em API." + error.message + "------------" + statusString},
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
          { error: "Ocorreu um erro ao inserir chamado em API." + error },
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
  }else if(solucao){
    try {
      const chamadoFinalizado = await finalizaChamado(idChamado, solucao)
      if(chamadoFinalizado === true){
        return NextResponse.json(true, { status: 200 });
      }else{
        return NextResponse.json(false, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao finalizar chamado em API." },
        { status: 500 }
      );
    }
  }else if (reabrir){
    try {
      const chamadoReaberto = await reabreChamado(idChamado);
      if(chamadoReaberto === true){
        return NextResponse.json(true, { status: 200 });
      }else{
        return NextResponse.json(false, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao reabrir chamado em API." },
        { status: 500 }
      );
    }
  }else if(arquivaDesarquiva === "ARQUIVAR"){
    try {
      const chamadoReaberto = await arquivaChamado(idChamado);
      if(chamadoReaberto){
        return NextResponse.json(chamadoReaberto, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao arquivar chamado em API." },
        { status: 500 }
      );
    }
  }else if(arquivaDesarquiva === "DESARQUIVAR"){
    try {
      const chamadoReaberto = await desarquivaChamado(idChamado);
      if(chamadoReaberto){
        return NextResponse.json(chamadoReaberto, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Ocorreu um erro ao desarquivar chamado em API." },
        { status: 500 }
      );
    }
  }
}
