import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token;
      }

      if (token.refreshToken) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              refresh_token: token.refreshToken,
              grant_type: "refresh_token",
            }).toString(),
          });

          if (!response.ok) throw new Error("Falha na atualização do token");

          const refreshedTokens = await response.json();
          token.accessToken = refreshedTokens.access_token;
          token.expiresAt =
            Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;
        } catch (error) {
          console.error("Erro ao atualizar o token:", error);
          delete token.refreshToken;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.expiresAt = token.expiresAt;
      return session;
    },

    async signIn({ user, account, profile }) {
      try {
        const email = profile?.email;
        if (!email) throw new Error("E-mail não encontrado no perfil");

        const usuarioExiste = await prisma.user.findUnique({ where: { email } });

        if (!usuarioExiste) {
          await prisma.user.create({
            data: {
              nome: profile?.name || "",
              email,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Erro ao verificar ou criar o usuário:", error);
        return false;
      }
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default authOptions;
