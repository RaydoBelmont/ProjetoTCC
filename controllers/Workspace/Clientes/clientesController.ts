import {createCliente, buscarClientesPorWorkspace, atualizarCliente, desativarCliente, ativarCliente} from "../../../models/Workspace/Clientes/clientesWorkspace"

export const novoCliente = async (
    workspaceId: number,
    nome: string,
    cpfCnpj: string,
    razao?: string,
    iE?: string,
    email?: string,
    observacao?: string,
    contatos?: {telefone: string }[],
    endereco?: {
      rua: string,
      numero: string,
      cep: string,
      bairro: string,
      cidade: string,
      uf: string,
    }
  ) => {
    try {
      const novoCliente = await createCliente(workspaceId, nome, cpfCnpj, razao, iE, email, observacao, contatos, endereco);
      return novoCliente;
    } catch (error) {
      console.error("Erro na criação de novo Cliente em Controller",error);
    }
  };

export const listarClientesPorWorkspace = async (workspaceId: number) => {
    try {
        const listaDeClientes = await buscarClientesPorWorkspace(workspaceId)
        return listaDeClientes
    } catch (error) {
        console.error("Erro na listagem de Clientes em Controller",error);
    }
}

export const updateCliente = async (
  id: number,
  nome: string,
  cpfCnpj: string,
  razao?: string,
  iE?: string,
  email?: string,
  observacao?: string,
  contatos?: { id: number; telefone: string }[],
  endereco?: {
    rua: string;
    numero: string;
    cep: string;
    bairro: string;
    cidade: string;
    uf: string;
  }
) => {
  try {
    const clienteAtualizado = await atualizarCliente(
      id,
      nome,
      cpfCnpj,
      razao,
      iE,
      email,
      observacao,
      contatos,
      endereco
    );
    return clienteAtualizado;
  } catch (error) {
    console.error("Erro ao tentar atualizar Cliente em Controller", error);
  }
};

export const desativaCliente = async (idCliente: number) => {
  try {
      const clienteDeletado = await desativarCliente(idCliente)
      return clienteDeletado
  } catch (error) {
      console.error("Erro ao Desativar Cliente em Controller",error);
  }
}

export const ativaCliente = async (idCliente: number) => {
  try {
      const clienteAtivado = await ativarCliente(idCliente)
      return clienteAtivado
  } catch (error) {
      console.error("Erro ao Ativar Cliente em Controller",error);
  }
}