import { useEffect, useState } from "react";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Typography,
  Badge,
  Button,
} from "../../lib/material-tailwindcss/material-tailwindcss";
import { buscarNotificacoesDoUser } from "@/app/lib/NotificacoesFunctions/libBuscarNotificacoes";
import { lerNaoLerNotificacao } from "@/app/lib/NotificacoesFunctions/libLerNaoLer";
import { arquivarNotificacao } from "@/app/lib/NotificacoesFunctions/libArquivarNotificacao";
import { buscaIdUserPorEmail } from "@/app/lib/UserFunctions/buscaIDuser";
import { useSession } from "next-auth/react";

type Notificacao = {
  id: number;
  tipo: string;
  mensagem: string;
  workspaceId: number;
  dataCriacao: Date;
  lido: boolean;
  arquivado: boolean;
};

export default function BotaoNotificacoes() {
  const [totalNotificacoes, setTotalNotificacoes] = useState<number>(0);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const { data: session } = useSession();

  const marcarComoLido = async (notificacaoId: number, lido: boolean) => {
    // Função para marcar a notificação como lida
    lerNaoLerNotificacao(notificacaoId, lido);
  };

  const marcarComoArquivado = async (notificacaoId: number, arquivado: boolean) => {
    // Função para marcar a notificação como arquivada
    arquivarNotificacao(notificacaoId, arquivado)
  };

  const ingressarNaWorkspace = (workspaceId: number) => {
    
  }

  useEffect(() => {
    if (session && session.user) {
      const fetchNotificacoes = async () => {
        const userId = await buscaIdUserPorEmail(session?.user?.email);
        const notificacoes = await buscarNotificacoesDoUser(Number(userId));
        if (notificacoes) {
          const notificacoesNaoLidasNaoArquivadas = notificacoes.filter(
            (n) => !n.lido && !n.arquivado
          );
          setTotalNotificacoes(notificacoesNaoLidasNaoArquivadas.length);
          setNotificacoes(notificacoes.filter((n) => !n.arquivado));
        }
      };
      fetchNotificacoes();
    }
  }, [session, marcarComoLido]);

  // Função para formatar a data no estilo DD/MM/AAAA - HH:MM
  const formatarData = (dataCriacao: Date) => {
    const data = new Date(dataCriacao);
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaFormatada = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dataFormatada} - ${horaFormatada}`;
  };

  return (
    <div className="relative inline-block">
      <Popover>
        <PopoverHandler>
          <button className="px-1 py-0 flex items-center rounded transition">
            {totalNotificacoes > 0 ? (
              <Badge
                content={totalNotificacoes}
                withBorder
                placement="top-end"
                className="bg-red-500 text-white"
              >
                <span className="text-lg mb-1">🔔</span>
              </Badge>
            ) : (
              <span className="text-lg mb-1">🔔</span>
            )}
          </button>
        </PopoverHandler>

        <PopoverContent className="bg-blue-gray-600 shadow-lg rounded-lg border-none p-2 w-72 mt-2 z-50 ">
          <Typography variant="h4" className="p-1 text-white">
            Notificações
          </Typography>
          {notificacoes.map((notificacao) => (
            <div
              key={notificacao.id}
              className="flex flex-col p-2 mt-2 justify-between bg-gray-300 rounded "
            >
              {/* Mostrando a data da notificação formatada */}
              <Typography
                variant="small"
                className="text-xs text-gray-500 mb-1 ml-1"
              >
                {formatarData(notificacao.dataCriacao)}
              </Typography>

              <div className="flex gap-2 pb-2 px-1 ">
                <Typography variant="small" className="font-medium">
                  {notificacao.mensagem}
                </Typography>
                <div className="flex justify-end gap-2">
                  {notificacao.lido === false ? (
                    <button
                      className="transition"
                      onClick={() => marcarComoLido(notificacao.id, true)}
                    >
                      ✔️
                    </button>
                  ) : (
                    <button
                      className="text-green-500 hover:text-green-600 transition"
                      onClick={() => marcarComoLido(notificacao.id, false)}
                    >
                      👁️‍🗨️
                    </button>
                  )}
                  <button
                    onClick={() => marcarComoArquivado(notificacao.id, true)}
                    className="text-blue-500 hover:text-blue-600 transition"
                  >
                    📦
                  </button>
                </div>
              </div>

              {notificacao.tipo === "CONVITE_WS" ? (
                <div className="flex flex-col">
                  <div className="border-b border-gray-500 my-2"></div>
                  <div className="flex gap-1 py-1">
                    <Button color="green" size="sm" variant="gradient">
                      Aceitar
                    </Button>
                    <Button color="red" size="sm" variant="gradient">
                      Recusar
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
