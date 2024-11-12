import { createCliente, buscarClientesPorWorkspace, atualizarCliente, desativarCliente, ativarCliente } from "../../models/Workspace/Clientes/clientesWorkspace";

jest.mock("../../models/Workspace/Clientes/clientesWorkspace");

describe("Testes de Clientes", () => {
  describe("createCliente", () => {
    it("deve criar um novo cliente com dados completos", async () => {
      const clienteMock = {
        id: 1,
        nome: "Cliente Teste",
        cpfCnpj: "12345678900",
        ativo: true,
        endereco: { rua: "Rua 1", numero: "100", cidade: "Cidade", uf: "UF" },
        contatos: [{ id: 1, telefone: "123456789" }],
      };

      (createCliente as jest.Mock).mockResolvedValue(clienteMock);

      const resultado = await createCliente(1, "Cliente Teste", "12345678900");
      expect(resultado).toEqual(clienteMock);
    });
  });

  describe("buscarClientesPorWorkspace", () => {
    it("deve retornar a lista de clientes de uma workspace", async () => {
      const clientesMock = [{ id: 1, nome: "Cliente Teste", cpfCnpj: "12345678900", ativo: true }];
      (buscarClientesPorWorkspace as jest.Mock).mockResolvedValue(clientesMock);

      const resultado = await buscarClientesPorWorkspace(1);
      expect(resultado).toEqual(clientesMock);
    });
  });

  describe("atualizarCliente", () => {
    it("deve atualizar um cliente existente", async () => {
      const clienteAtualizadoMock = { id: 1, nome: "Cliente Atualizado", cpfCnpj: "12345678900" };
      (atualizarCliente as jest.Mock).mockResolvedValue(clienteAtualizadoMock);

      const resultado = await atualizarCliente(1, "Cliente Atualizado", "12345678900");
      expect(resultado).toEqual(clienteAtualizadoMock);
    });
  });

  describe("desativarCliente", () => {
    it("deve desativar um cliente", async () => {
      const clienteDesativadoMock = { id: 1, ativo: false };
      (desativarCliente as jest.Mock).mockResolvedValue(clienteDesativadoMock);

      const resultado = await desativarCliente(1);
      expect(resultado).toEqual(clienteDesativadoMock);
    });
  });

  describe("ativarCliente", () => {
    it("deve ativar um cliente", async () => {
      const clienteAtivadoMock = { id: 1, ativo: true };
      (ativarCliente as jest.Mock).mockResolvedValue(clienteAtivadoMock);

      const resultado = await ativarCliente(1);
      expect(resultado).toEqual(clienteAtivadoMock);
    });
  });
});
