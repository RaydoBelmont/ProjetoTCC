import prisma from "../../prisma/prisma";

export const buscarUserPorEmail = async (email: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      let userId = Number(user?.id);
      return userId;
    }catch(error){
        console.error("Erro ao obter ID do usuário:", error);
        throw new Error("Ocorreu um erro obter ID do usuário em Model User.");
    }
  };

  export const inserirNovoUsuario = async(nome: string, email: string) => {
    try {
     const novoUser =  await prisma.user.create({
        data: {
          nome: nome,
         email: email
        },
      });

      return novoUser;
    } catch (error) {
      console.error("Erro ao criar novo usuário:", error);
        throw new Error("Ocorreu um erro ao criar novo usuário em Model User.");
    }
  }