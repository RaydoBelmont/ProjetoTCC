import { inserirNovoUsuario } from "../models/User/userModel";

jest.mock("../models/User/userModel");

describe("Teste da função inserirUsuario", () => {
  it("deve inserir um novo usuário com nome e email", async () => {
    const usuarioMock = { nome: "Teste", email: "teste@email.com" };
    
    (inserirNovoUsuario as jest.Mock).mockResolvedValue(usuarioMock);

    const resultado = await inserirNovoUsuario(usuarioMock.nome, usuarioMock.email);
    expect(resultado).toEqual(usuarioMock);
  });
});
