import {
    createSetor,
    getSetoresByWorkspaceIdAndUserId,
    getSetor,
    editarNomeSetor,
    inserirMembroNoSetor,
    removerMembroDoSetor,
  } from "../../models/Setores/setores";

  jest.mock("../../models/Setores/setores");
  
  describe("Testes de Setor", () => {
    describe("createSetor", () => {
      it("deve criar um novo setor e associar um membro", async () => {
        const setorMock = { id: 1, nome: "Financeiro", workspaceId: 1, membros: [{ userId: 1 }] };
        (createSetor as jest.Mock).mockResolvedValue(setorMock);
  
        const novoSetor = await createSetor(1, "Financeiro", 1);
        expect(novoSetor).toEqual(setorMock);
      });
    });
  
    describe("getSetoresByWorkspaceIdAndUserId", () => {
      it("deve retornar setores específicos para um workspace e usuário", async () => {
        const setoresMock = [{ id: 1, nome: "Financeiro", workspaceId: 1 }];
        (getSetoresByWorkspaceIdAndUserId as jest.Mock).mockResolvedValue(setoresMock);
  
        const setores = await getSetoresByWorkspaceIdAndUserId(1, 1);
        expect(setores).toEqual(setoresMock);
      });
    });
  
    describe("getSetor", () => {
      it("deve retornar um setor específico com seus membros", async () => {
        const setorMock = { id: 1, nome: "Financeiro", membros: [{ userId: 1, user: { id: 1, nome: "User1" } }] };
        (getSetor as jest.Mock).mockResolvedValue(setorMock);
  
        const setor = await getSetor(1);
        expect(setor).toEqual(setorMock);
      });
    });
  
    describe("editarNomeSetor", () => {
      it("deve atualizar o nome de um setor", async () => {
        const setorAtualizadoMock = { id: 1, nome: "RH" };
        (editarNomeSetor as jest.Mock).mockResolvedValue(setorAtualizadoMock);
  
        const setorAtualizado = await editarNomeSetor(1, "RH");
        expect(setorAtualizado).toEqual(setorAtualizadoMock);
      });
    });
  
    describe("inserirMembroNoSetor", () => {
      it("deve adicionar um membro ao setor", async () => {
        const membroMock = { setorId: 1, userId: 2 };
        (inserirMembroNoSetor as jest.Mock).mockResolvedValue(membroMock);
  
        const membroInserido = await inserirMembroNoSetor(1, 2);
        expect(membroInserido).toEqual(membroMock);
      });
    });
  
    describe("removerMembroDoSetor", () => {
      it("deve remover um membro do setor", async () => {
        const membroRemovidoMock = { setorId: 1, userId: 2 };
        (removerMembroDoSetor as jest.Mock).mockResolvedValue(membroRemovidoMock);
  
        const membroRemovido = await removerMembroDoSetor(1, 2);
        expect(membroRemovido).toEqual(membroRemovidoMock);
      });
    });
  });
  