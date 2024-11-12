import { getHistoricoChamado, putHistoricoChamado } from "../../../models/Chamados/historico/chamadoHistoricoModel";

jest.mock("../../../models/Chamados/historico/chamadoHistoricoModel");

describe("Testes de Histórico de Chamados", () => {
  describe("getHistoricoChamado", () => {
    it("deve retornar o histórico de um chamado específico formatado corretamente", async () => {
      const historicoMock = [
        {
          chamadoId: 1,
          tipo: "Prioridade",
          valorAnterior: "1",
          valorNovo: "2",
          user: { nome: "Usuário Teste" },
          criadoEm: new Date(),
        },
      ];
      
      (getHistoricoChamado as jest.Mock).mockResolvedValue(historicoMock);

      const historico = await getHistoricoChamado(1);
      
      expect(historico).toEqual([
        {
          chamadoId: 1,
          tipo: "Prioridade",
          valorAnterior: "1",
          valorNovo: "2",
          user: { nome: "Usuário Teste" },
          criadoEm: historicoMock[0].criadoEm,
        },
      ]);
    });
  });

  describe("putHistoricoChamado", () => {
    it("deve criar um novo registro de histórico de chamado", async () => {
      const historicoCriadoMock = {
        chamadoId: 1,
        alteradoPorId: 2,
        tipo: "Status",
        descricao: "Alteração de status",
        valorAnterior: "Em aberto",
        valorNovo: "Em andamento",
      };
      
      (putHistoricoChamado as jest.Mock).mockResolvedValue(historicoCriadoMock);

      const historico = await putHistoricoChamado(
        1,
        2,
        "Status",
        "Alteração de status",
        "Em aberto",
        "Em andamento"
      );

      expect(historico).toEqual(historicoCriadoMock);
    });
  });
});
