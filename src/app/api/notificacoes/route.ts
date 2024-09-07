import { NextRequest, NextResponse } from "next/server";
import {
  buscaNotificacoes,
  novaNotificacao,
  lerNotificacao,
  arquivarNotificacao,
  aceitarConvite,
} from "../../../../controllers/Notificacoes/notificacoesController";

export async function GET(req: NextRequest) {
  // // Verifica se o usuário está autenticado
  // const session = await getServerSession(authOpcoes);

  // if (!session) {

  //   return new NextResponse("Requisição não autorizada!", { status: 401 });
  // }

  const userId = Number(req.nextUrl.searchParams.get("userId"));

  if (userId !== null) {
    const idUser = await buscaNotificacoes(userId);
    return NextResponse.json(idUser, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const data = await req.json();

    const userId = Number(data.userId);
    const tipo = data.tipo;
    const mensagem = data.mensagem;
    const idWorkspace = Number(data.idWorkspace);

    if (!userId || !tipo || !mensagem) {
      return NextResponse.json(
        { error: "ID do Usuario, tipo, e mensagem são obrigatórios." },
        { status: 400 }
      );
    }

    if (userId && idWorkspace) {
      try {
        const notificacao = await novaNotificacao(
          userId,
          tipo,
          mensagem,
          idWorkspace
        );
        return NextResponse.json(notificacao, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar inserir nova Notificacao em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar inserir nova Notificacao em API" },
          { status: 500 }
        );
      }
    } else if (userId && !idWorkspace) {
      const notificacao = await novaNotificacao(userId, tipo, mensagem);
      return NextResponse.json(notificacao, { status: 200 });
    } else
      return NextResponse.json(
        { error: "Método não permitido." },
        { status: 405 }
      );
  }
}


export async function PATCH(req: NextRequest) {
  if (req.method === "PATCH") {
    const data = await req.json();
    const notificacaoId = data.notificacaoId;
    const lido = data.lido;
    const aceito = data.aceito;

    // Verifica se existe `notificacaoId` e `lido`
    if (notificacaoId && lido !== undefined) {
      try {
        const notificacaoLida = await lerNotificacao(notificacaoId, lido);
        return NextResponse.json(notificacaoLida, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar ler/Nao Ler uma Notificacao em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar ler/Nao Ler uma Notificacao em API" },
          { status: 500 }
        );
      }
    } 
    // Verifica se existe `notificacaoId` e `aceito`
    else if (notificacaoId && aceito !== undefined) {
      try {
        const conviteAceito = await aceitarConvite(notificacaoId, aceito);
        return NextResponse.json(conviteAceito, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar aceitar/recusar convite em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar aceitar/recusar convite em API" },
          { status: 500 }
        );
      }
    } 
    // Caso `notificacaoId` não exista ou nenhum dos outros parâmetros tenha sido fornecido
    else {
      return NextResponse.json(
        { error: "Dados inválidos fornecidos." },
        { status: 400 }
      );
    }
  } else {
    // Retorno para métodos não permitidos
    return NextResponse.json(
      { error: "Método não permitido em API." },
      { status: 405 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  if (req.method === "DELETE") {
    const data = await req.json();
    const notificacaoId = data.notificacaoId;
    const arquivado = data.arquivado;

    if (notificacaoId && arquivado !== undefined) {
      try {
        const notificacaoArquivada = await arquivarNotificacao(notificacaoId, arquivado);
        return NextResponse.json(notificacaoArquivada, { status: 200 });
      } catch (error) {
        console.error("Erro ao tentar arquivar uma Notificacao em API:", error);
        return NextResponse.json(
          { error: "Erro ao tentar arquivar uma Notificacao em API" },
          { status: 500 }
        );
      }
    } else {
      // Retorno caso notificacaoId ou lido sejam inválidos
      return NextResponse.json(
        { error: "Dados inválidos fornecidos." },
        { status: 400 }
      );
    }
  } else {
    // Retorno para métodos não permitidos
    return NextResponse.json(
      { error: "Método não permitido em API." },
      { status: 405 }
    );
  }
}
