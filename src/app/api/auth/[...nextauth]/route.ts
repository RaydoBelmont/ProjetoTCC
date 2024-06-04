import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization:
        `https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login` ??
        "",
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email;
      try {
        const usuarioExiste = await prisma.user.findUnique({
          where: { email },
        });
        if (usuarioExiste) {
          return true;
        } else {
          try {
            const novoUsuario = await prisma.user.create({
              data: {
                nome: profile?.name ? profile.name : "",
                email: profile?.email ? profile.email : "",
              },
            });
            if (novoUsuario) {
              console.log("Novo usuário criado:", novoUsuario);
              return true
            } else {
              console.log("Usuário existente:", novoUsuario);
              return false
            }
          } catch (error) {
            console.log(error);
          }
        }
        return true
      } catch (error) {
        console.log(error);
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
