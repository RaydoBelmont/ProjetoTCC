import { setaAdmin, buscaMembroWorkspace,buscaMembrosWorkspace,inserirMembroNaWorkspace } from "../../models/Workspace/Membros/membrosModel";

jest.mock("../../models/Workspace/Membros/membrosModel");

describe("Teste da função para setar um usuiario admin", () => {
    it("deve alterar o valor de isAdmin de um usuario ligado a uma workspace", async () => {
      const admin = { idWorkspace: 1, iduser: 1, isAdmin: true };
      
      (setaAdmin as jest.Mock).mockResolvedValue(admin);
  
      const resultado = await setaAdmin(admin.idWorkspace, admin.iduser, admin.isAdmin);
      expect(resultado.isAdmin).toEqual(true);
    });
  });
  
  describe("Teste da função para buscar um membro específico da Workspace", () => {
    it("deve buscar um membro específico de uma workspace com o id e id do membro", async () => {
      const usuario = { 
        idWorkspace: 1, 
        iduser: 1 
      };
  
      const respostaMock = {
        id: 1,
        nome: "Nome Teste",
        email: "teste@teste.com",
        isAdmin: false,
        isCriador: false,
        usuarioExiste: false || true, 
      };
      
      (buscaMembroWorkspace as jest.Mock).mockResolvedValue(respostaMock);
  
      const resultado = await buscaMembroWorkspace(usuario.idWorkspace, usuario.iduser);
      expect(resultado.usuarioExiste).toEqual(false || true);
    });
  });
  
  describe("Teste da função para buscar membros da Workspace", () => {
    it("deve buscar membros de uma workspace com o id", async () => {
      const usuario = { 
        idWorkspace: 1, 
      };
  
      const respostaMock = {
        id: 1,
        nome: "Nome Teste",
        email: "teste@teste.com",
        isAdmin: false,
        isCriador: false,
      };
      
      (buscaMembrosWorkspace as jest.Mock).mockResolvedValue(respostaMock);
  
  
      const resultado = await buscaMembrosWorkspace(usuario.idWorkspace);
      expect(resultado).toEqual(respostaMock);
    });
  });

  describe("Teste da função para inserir membros na Workspace", () => {
    it("deve inserir um usuario em uma workspace com o id", async () => {
      const usuario = { 
        idWorkspace: 1, 
        iduser: 1 
      };
  
      const respostaMock = {
        userId: 1,
        workspaceId: 1,
        isAdmin: false,
        isCriador: false,
      };
      
      (inserirMembroNaWorkspace as jest.Mock).mockResolvedValue(respostaMock);
  
  
      const resultado = await inserirMembroNaWorkspace(usuario.idWorkspace, usuario.iduser);
      expect(resultado).toEqual(respostaMock);
    });
  });