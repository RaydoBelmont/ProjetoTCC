export const atualizarCliente = async (
  id: number,
  nome: string,
  cpfCnpj: string,
  razao: string,
  iE: string,
  email: string,
  observacao: string,
  endereco,
  contatos
) => {
  try {
    const response = await fetch(`/api/workspace/clientes?idCliente=${id}`, {
      method: "PUT", // ou 'PATCH' dependendo do seu endpoint
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        cpfCnpj,
        razao,
        iE,
        email,
        observacao,
        endereco,
        contatos,
      }),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar cliente");
    }

    const clienteAtualizado = await response.json();
    return clienteAtualizado;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
  }
};
