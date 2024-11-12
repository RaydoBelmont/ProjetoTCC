import { createWorkspace, getWorkspacesByUserId,
    getWorkspaceName,
    checkAdminStatus,
    verificaUsuarioComWorkspace, editaWorkspace} from "../../models/Workspace/workspace";

jest.mock("../../models/Workspace/workspace");

describe("Teste da função inserir Nova Workspace(createWorkspace)", () => {
  it("deve inserir uma nova workspace com Nome e Email do Usuario", async () => {
    const novaWorkspace = { nome: "Teste", email: "teste@email.com" };
    
    (createWorkspace as jest.Mock).mockResolvedValue(novaWorkspace);

    const resultado = await createWorkspace(novaWorkspace.nome, novaWorkspace.email);
    expect(resultado).toEqual(novaWorkspace);
  });
});

describe("Teste da função buscar pelas Workspaces(getWorkspaceName)", () => {
    it("deve buscar por uma lista de workspaces, com o email do Usuario", async () => {
      const listaWorkspace = [{ id: 1, nome: "teste" }];
      
      (getWorkspacesByUserId as jest.Mock).mockResolvedValue(listaWorkspace);
  
      const resultado = await getWorkspacesByUserId("802.358@alunos.unigran.br");
      expect(resultado).toEqual(listaWorkspace);
    });
  });
  
  describe("Teste da função para buscar somente o nome da workspace especifica(getWorkspaceName)", () => {
    it("deve buscar por uma workspace e somente o nome dela, pela Id", async () => {
      const workspace = {nome: "teste"};
      
      (getWorkspaceName as jest.Mock).mockResolvedValue(workspace);
  
      const resultado = await getWorkspaceName(1);
      expect(resultado).toEqual(workspace);
    });
  });

  
  describe("Teste da função verificar se o usuario é admin de uma workspace", () => {
    it("deve buscar os dados do usuario dentro da workspace para saber se é admin ou nao", async () => {
      const admin = {    isAdmin: true,
        isCriador: true,
        userId: 1,
        workspaceId: 1};
      
        const user = {email: "teste@teste.com", idWorkspace: 1};

      (checkAdminStatus as jest.Mock).mockResolvedValue(admin);
  
      const resultado = await checkAdminStatus(user.email, user.idWorkspace);
      expect(resultado).toEqual(admin);
    });
  });
  
  
  describe("Teste da função para verificar se o usuario pertence a workspace especifica", () => {
    it("deve buscar por um usuario dentro de uma workspace com id de usuario e id de workspace", async () => {
      const usuarioPertence = true;
      const user = {email: "teste@teste.com", idWorkspace: 1};

      (verificaUsuarioComWorkspace as jest.Mock).mockResolvedValue(usuarioPertence);
  
      const resultado = await verificaUsuarioComWorkspace(user.email, user.idWorkspace);
      expect(resultado).toEqual(usuarioPertence);
    });
  });
  
  describe("Teste da função para editar nome da workspace", () => {
    it("deve alterar o nome da workspace passando id e nome da workspace", async () => {
      const workspace = { id: 1, nome: "teste"};

      (editaWorkspace as jest.Mock).mockResolvedValue(workspace);
  
      const resultado = await editaWorkspace(workspace.nome, workspace.id);
      expect(resultado).toEqual(workspace);
    });
  });
  