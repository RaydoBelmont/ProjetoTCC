import { buscarUserPorEmail } from "../../models/User/userModel";

export const buscarPorUser = async (email: string) => {
    const emailUser = email;
    try {
      const userId = await buscarUserPorEmail(emailUser);
      return userId
    } catch (error) {
      console.error('Erro ao obter ID do user em controller:', error);
    }
  }