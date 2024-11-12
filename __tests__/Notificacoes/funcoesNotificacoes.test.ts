import {
    buscaNotificacoesPorUsuario,
    inserirNotificacao,
    marcarNotificacaoComoLido,
    marcarNotificacaoComoArquivada,
    conviteAceito,
  } from "../../models/Notificacoes/notificacoesModel";
  
  jest.mock("../../models/Notificacoes/notificacoesModel");
  
  describe("Testes de Notificações", () => {
    describe("buscaNotificacoesPorUsuario", () => {
      it("deve retornar uma lista de notificações de um usuário específico", async () => {
        const notificacoesMock = [
          { id: 1, userId: 1, mensagem: "Nova mensagem", dataCriacao: new Date() },
          { id: 2, userId: 1, mensagem: "Notificação 2", dataCriacao: new Date() },
        ];
        (buscaNotificacoesPorUsuario as jest.Mock).mockResolvedValue(notificacoesMock);
  
        const notificacoes = await buscaNotificacoesPorUsuario(1);
        expect(notificacoes).toEqual(notificacoesMock);
      });
    });
  
    describe("inserirNotificacao", () => {
      it("deve inserir uma nova notificação", async () => {
        const novaNotificacaoMock = { id: 3, userId: 1, tipo: "info", mensagem: "Bem-vindo" };
        (inserirNotificacao as jest.Mock).mockResolvedValue(novaNotificacaoMock);
  
        const notificacao = await inserirNotificacao(1, "info", "Bem-vindo");
        expect(notificacao).toEqual(novaNotificacaoMock);
      });
    });
  
    describe("marcarNotificacaoComoLido", () => {
      it("deve marcar a notificação como lida", async () => {
        const notificacaoMock = { id: 1, lido: true };
        (marcarNotificacaoComoLido as jest.Mock).mockResolvedValue(notificacaoMock.lido);
  
        const lido = await marcarNotificacaoComoLido(1, true);
        expect(lido).toBe(true);
      });
    });
  
    describe("marcarNotificacaoComoArquivada", () => {
      it("deve marcar a notificação como arquivada", async () => {
        const notificacaoMock = { id: 1, arquivado: true };
        (marcarNotificacaoComoArquivada as jest.Mock).mockResolvedValue(notificacaoMock.arquivado);
  
        const arquivado = await marcarNotificacaoComoArquivada(1, true);
        expect(arquivado).toBe(true);
      });
    });
  
    describe("conviteAceito", () => {
      it("deve marcar o convite como aceito", async () => {
        const notificacaoMock = { id: 1, aceito: true };
        (conviteAceito as jest.Mock).mockResolvedValue(notificacaoMock.aceito);
  
        const aceito = await conviteAceito(1, true);
        expect(aceito).toBe(true);
      });
    });
  });
  