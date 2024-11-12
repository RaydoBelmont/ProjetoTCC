import {
    criarChamado,
    buscarChamadosPorQuadro,
    buscaChamado,
    alterarChamado,
    inserirMembro,
    removerMembro,
    transferirChamado,
    finalizarChamado,
    reabrirChamado,
    arquivarChamado,
    desarquivarChamado,
  } from "../../models/Chamados/chamados";
  import { StatusEnum } from "@prisma/client";
  
  jest.mock("../../models/Chamados/chamados");
  
  describe("Testes de Chamados", () => {
    describe("criarChamado", () => {
      it("deve criar um novo chamado", async () => {
        const novoChamadoMock = {
          id: 1,
          titulo: "Chamado Teste",
          descricao: "Descrição do chamado",
          prioridadeId: 1,
          clienteId: 1,
          quadroId: 1,
          workspaceId: 1,
          criadoPor: 1,
        };
        (criarChamado as jest.Mock).mockResolvedValue(novoChamadoMock);
  
        const chamado = await criarChamado(1, "Chamado Teste", "Descrição do chamado", 1, 1, 1, 1);
        expect(chamado).toEqual(novoChamadoMock);
      });
    });
  
    describe("buscarChamadosPorQuadro", () => {
      it("deve retornar uma lista de chamados para o quadro especificado", async () => {
        const chamadosMock = [
          { id: 1, titulo: "Chamado 1" },
          { id: 2, titulo: "Chamado 2" },
        ];
        (buscarChamadosPorQuadro as jest.Mock).mockResolvedValue(chamadosMock);
  
        const chamados = await buscarChamadosPorQuadro(1);
        expect(chamados).toEqual(chamadosMock);
      });
    });
  
    describe("buscaChamado", () => {
      it("deve retornar os detalhes de um chamado específico", async () => {
        const chamadoMock = { id: 1, titulo: "Chamado Detalhado" };
        (buscaChamado as jest.Mock).mockResolvedValue(chamadoMock);
  
        const chamado = await buscaChamado(1);
        expect(chamado).toEqual(chamadoMock);
      });
    });
  
    describe("alterarChamado", () => {
      it("deve alterar o título do chamado", async () => {
        const chamadoAlteradoMock = { id: 1, titulo: "Novo Título" };
        (alterarChamado as jest.Mock).mockResolvedValue(chamadoAlteradoMock);
  
        const chamado = await alterarChamado(1, "Novo Título");
        expect(chamado).toEqual(chamadoAlteradoMock);
      });
  
      it("deve alterar o status do chamado", async () => {
        const chamadoAlteradoMock = { id: 1, status: StatusEnum.CONCLUIDO };
        (alterarChamado as jest.Mock).mockResolvedValue(chamadoAlteradoMock);
  
        const chamado = await alterarChamado(1, undefined, StatusEnum.CONCLUIDO);
        expect(chamado.status).toEqual(StatusEnum.CONCLUIDO);
      });
    });
  
    describe("inserirMembro", () => {
      it("deve inserir um membro no chamado", async () => {
        const membroMock = { chamadoId: 1, userId: 2 };
        (inserirMembro as jest.Mock).mockResolvedValue(membroMock);
  
        const membro = await inserirMembro(1, 2);
        expect(membro).toEqual(membroMock);
      });
    });
  
    describe("removerMembro", () => {
      it("deve remover um membro do chamado", async () => {
        const membroRemovidoMock = { chamadoId: 1, userId: 2 };
        (removerMembro as jest.Mock).mockResolvedValue(membroRemovidoMock);
  
        const membroRemovido = await removerMembro(1, 2);
        expect(membroRemovido).toEqual(membroRemovidoMock);
      });
    });
  
    describe("transferirChamado", () => {
      it("deve transferir o chamado para outro quadro", async () => {
        (transferirChamado as jest.Mock).mockResolvedValue(true);
  
        const transferido = await transferirChamado(1, 2);
        expect(transferido).toBe(true);
      });
    });
  
    describe("finalizarChamado", () => {
      it("deve finalizar o chamado com uma solução", async () => {
        (finalizarChamado as jest.Mock).mockResolvedValue(true);
  
        const finalizado = await finalizarChamado(1, "Solução Teste");
        expect(finalizado).toBe(true);
      });
    });
  
    describe("reabrirChamado", () => {
      it("deve reabrir o chamado", async () => {
        (reabrirChamado as jest.Mock).mockResolvedValue(true);
  
        const reaberto = await reabrirChamado(1);
        expect(reaberto).toBe(true);
      });
    });
  
    describe("arquivarChamado", () => {
      it("deve arquivar o chamado", async () => {
        const chamadoArquivadoMock = { id: 1, arquivado: true };
        (arquivarChamado as jest.Mock).mockResolvedValue(chamadoArquivadoMock);
  
        const arquivado = await arquivarChamado(1);
        expect(arquivado).toEqual(chamadoArquivadoMock);
      });
    });
  
    describe("desarquivarChamado", () => {
      it("deve desarquivar o chamado", async () => {
        const chamadoDesarquivadoMock = { id: 1, arquivado: false };
        (desarquivarChamado as jest.Mock).mockResolvedValue(chamadoDesarquivadoMock);
  
        const desarquivado = await desarquivarChamado(1);
        expect(desarquivado).toEqual(chamadoDesarquivadoMock);
      });
    });
  });
  