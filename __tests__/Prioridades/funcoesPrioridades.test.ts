import { getPrioridade, inserirPrioridade, editarPrioridade } from "../../models/prioridades/prioridadesModel";

jest.mock("../../models/prioridades/prioridadesModel");

describe("Testes de Prioridade", () => {
  describe("getPrioridade", () => {
    it("deve retornar uma lista de prioridades para um setor específico", async () => {
      const prioridadesMock = [
        { id: 1, nome: "Alta", setorId: 1 },
        { id: 2, nome: "Média", setorId: 1 },
      ];
      (getPrioridade as jest.Mock).mockResolvedValue(prioridadesMock);

      const prioridades = await getPrioridade(1);
      expect(prioridades).toEqual(prioridadesMock);
    });
  });

  describe("inserirPrioridade", () => {
    it("deve criar uma nova prioridade", async () => {
      const novaPrioridadeMock = { id: 3, nome: "Baixa", setorId: 1 };
      (inserirPrioridade as jest.Mock).mockResolvedValue(novaPrioridadeMock);

      const prioridade = await inserirPrioridade(1, "Baixa");
      expect(prioridade).toEqual(novaPrioridadeMock);
    });
  });

  describe("editarPrioridade", () => {
    it("deve editar o nome de uma prioridade existente", async () => {
      const prioridadeEditadaMock = { id: 1, nome: "Urgente", setorId: 1 };
      (editarPrioridade as jest.Mock).mockResolvedValue(prioridadeEditadaMock);

      const prioridade = await editarPrioridade(1, "Urgente");
      expect(prioridade).toEqual(prioridadeEditadaMock);
    });
  });
});
