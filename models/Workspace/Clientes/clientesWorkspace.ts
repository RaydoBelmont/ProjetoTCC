import prisma from "../../../prisma/prisma";

export const createCliente = async (
  workspaceId: number,
  nome: string,
  cpfCnpj: string,
  razao?: string,
  iE?: string,
  email?: string,
  observacao?: string,
  contatos?: { telefone: string }[],
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
    // Cria o cliente com o endereço e contatos, se fornecidos
    const cliente = await prisma.clientes.create({
      data: {
        nome,
        razao,
        cpfCnpj,
        iE,
        email,
        observacao,
        workspaceId,
        endereco: endereco
          ? {
              create: endereco,
            }
          : undefined,
        contatos: contatos?.length
          ? {
              create: contatos,
            }
          : undefined,
      },
      select: {
        id: true,
        nome: true,
        cpfCnpj: true,
        razao: true,
        iE: true,
        email: true,
        observacao: true,
        ativo: true,
        endereco: {
          select: {
            id: true,
            rua: true,
            numero: true,
            cep: true,
            bairro: true,
            cidade: true,
            uf: true,
          },
        },
        contatos: {
          select: {
            id: true,
            telefone: true,
          },
        },
      },
    });

    return cliente;
  } catch (error) {
    console.error("Erro ao criar o cliente:", error);
    throw new Error("Ocorreu um erro ao criar o cliente.");
  }
};

export const buscarClientesPorWorkspace = async (workspaceId: number) => {
  try {
    const clientes = await prisma.clientes.findMany({
      where: {
        workspaceId,
      },
      select: {
        // Use 'select' to specify which fields to return
        id: true,
        nome: true,
        cpfCnpj: true,
        razao: true,
        iE: true,
        email: true,
        observacao: true,
        ativo: true,
        endereco: {
          select: {
            id: true,
            rua: true,
            numero: true,
            cep: true,
            bairro: true,
            cidade: true,
            uf: true,
          },
        },
        contatos: {
          select: {
            id: true,
            telefone: true,
          },
        },
      },
    });

    return clientes;
  } catch (error) {
    console.error("Erro ao obter os Clientes do workspace:", error);
    throw new Error("Ocorreu um erro ao obter os Clientes do workspace.");
  }
};

export const atualizarCliente = async (
  id: number,
  nome?: string,
  cpfCnpj?: string,
  razao?: string,
  iE?: string,
  email?: string,
  observacao?: string,
  contatos?: {
    id?: number;
    telefone?: string;
  }[],
  endereco?: {
    rua?: string;
    numero?: string;
    cep?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  }
) => {
  try {
    const contatosParaAtualizar =
      contatos?.filter((contato) => contato.id) || [];
    const contatosParaCriar = contatos?.filter((contato) => !contato.id) || [];

    const clienteAtualizado = await prisma.clientes.update({
      where: { id },
      data: {
        nome: nome,
        cpfCnpj: cpfCnpj,
        razao: razao,
        iE: iE,
        email: email,
        observacao: observacao,
        endereco: endereco
          ? {
              update: endereco,
            }
          : undefined,
        contatos: {
          update: contatosParaAtualizar.map((contato) => ({
            where: { id: contato.id },
            data: { telefone: contato.telefone },
          })),
          create: contatosParaCriar.map((contato) => ({
            telefone: contato.telefone,
          })),
        },
      },
      select: {
        // Use 'select' to specify which fields to return
        id: true,
        nome: true,
        cpfCnpj: true,
        razao: true,
        iE: true,
        email: true,
        observacao: true,
        ativo: true,
        endereco: {
          select: {
            id: true,
            rua: true,
            numero: true,
            cep: true,
            bairro: true,
            cidade: true,
            uf: true,
          },
        },
        contatos: {
          select: {
            id: true,
            telefone: true,
          },
        },
      },
    });

    return clienteAtualizado;
  } catch (error) {
    console.error("Erro ao atualizar o cliente em model:", error);
    throw new Error("Ocorreu um erro ao atualizar o cliente em model.");
  }
};

export const desativarCliente = async (clienteId: number) => {
  const id = clienteId;
  try {
    const clienteDesativado = await prisma.clientes.update({
      where: { id },
      data: { ativo: false },
    });
    return clienteDesativado
  } catch (error) {
    console.error("Erro ao desativar o cliente em model:", error);
    throw new Error("Ocorreu um erro ao desativar o cliente em model.");
  }
};

export const ativarCliente = async (clienteId: number) => {
  const id = clienteId;
  try {
    const clienteAtivado = await prisma.clientes.update({
      where: { id },
      data: { ativo: true },
    });
    return clienteAtivado
  } catch (error) {
    console.error("Erro ao ativar o cliente em model:", error);
    throw new Error("Ocorreu um erro ao ativar o cliente em model.");
  }
};