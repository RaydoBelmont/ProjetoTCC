import { buscarUserPorEmail, inserirNovoUsuario } from "../../models/User/userModel";

jest.mock("../../models/User/userModel");

describe("Testes de Usuário", () => {
  describe("buscarUserPorEmail", () => {
    it("deve retornar o ID do usuário se o email existir", async () => {
      const userMock = { id: 1, email: "teste@exemplo.com" };
      (buscarUserPorEmail as jest.Mock).mockResolvedValue(userMock.id);

      const userId = await buscarUserPorEmail("teste@exemplo.com");
      expect(userId).toEqual(userMock.id);
    });

    it("deve retornar undefined se o email não existir", async () => {
      (buscarUserPorEmail as jest.Mock).mockResolvedValue(null);

      const userId = await buscarUserPorEmail("naoexiste@exemplo.com");
      expect(userId).toBeNull();
    });
  });

  describe("inserirNovoUsuario", () => {
    it("deve inserir um novo usuário e retornar os dados dele", async () => {
      const novoUserMock = { id: 1, nome: "Novo Usuário", email: "novo@exemplo.com" };
      (inserirNovoUsuario as jest.Mock).mockResolvedValue(novoUserMock);

      const novoUser = await inserirNovoUsuario("Novo Usuário", "novo@exemplo.com");
      expect(novoUser).toEqual(novoUserMock);
    });
  });
});
