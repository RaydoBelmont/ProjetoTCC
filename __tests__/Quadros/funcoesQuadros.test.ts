import { getQuadros, criarQuadro, editarQuadro } from "../../models/Quadros/quadros";


jest.mock("../../models/Quadros/quadros");

describe("Testes de Quadro", () => {
  describe("getQuadros", () => {
    it("deve retornar uma lista de quadros para um setor específico", async () => {
      const quadrosMock = [
        { id: 1, nome: "Quadro 1", setorId: 1, responsavel: { id: 1, nome: "Responsável 1" } },
        { id: 2, nome: "Quadro 2", setorId: 1, responsavel: { id: 2, nome: "Responsável 2" } },
      ];
      (getQuadros as jest.Mock).mockResolvedValue(quadrosMock);

      const quadros = await getQuadros(1);
      expect(quadros).toEqual(quadrosMock);
    });
  });

  describe("criarQuadro", () => {
    it("deve criar um novo quadro", async () => {
      const novoQuadroMock = { id: 1, nome: "Quadro Teste", setorId: 1, responsavelId: 1 };
      (criarQuadro as jest.Mock).mockResolvedValue(novoQuadroMock);

      const novoQuadro = await criarQuadro("Quadro Teste", 1, 1);
      expect(novoQuadro).toEqual(novoQuadroMock);
    });
  });

  describe("editarQuadro", () => {
    it("deve editar o nome de um quadro existente", async () => {
      const quadroEditadoMock = { id: 1, nome: "Quadro Editado", setorId: 1, responsavelId: 1 };
      (editarQuadro as jest.Mock).mockResolvedValue(quadroEditadoMock);

      const quadroEditado = await editarQuadro("Quadro Editado", 1);
      expect(quadroEditado).toEqual(quadroEditadoMock);
    });
  });
});
