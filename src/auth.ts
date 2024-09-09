import NextAuth  from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface CustomToken {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Definição da interface da sessão personalizada
interface CustomSession {
  accessToken?: string;
  expiresAt?: number;
}


const authOptions  =  ({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization:
        `https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login` ??
        "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {

    async jwt({ token, account }) {
      // Inicializa o token com informações da conta quando o usuário faz login
      if (account) {
        (token as CustomToken).accessToken = account.access_token;
        (token as CustomToken).refreshToken = account.refresh_token; // Se disponível
        (token as CustomToken).expiresAt = account.expires_at;
      }

        // Se o token está expirado, renove o token usando o refresh token
        if (Date.now() < ((token as CustomToken).expiresAt ?? 0) * 1000) {
          return token;
        }

        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: (token as CustomToken).refreshToken ?? '',
            client_id: process.env.GOOGLE_CLIENT_ID ?? "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
          }),
        });

        const refreshedTokens = await response.json();

        (token as CustomToken).accessToken = refreshedTokens.access_token;
        (token as CustomToken).expiresAt = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;


        return token;
    },

    async session({ session, token }) {
      // Adiciona o token de acesso e a expiração ao objeto da sessão
      const customToken = token as CustomToken;
      (session as CustomSession).accessToken = customToken.accessToken;
      (session as CustomSession).expiresAt = customToken.expiresAt;

      return session;
    },



    async signIn({ user, account, profile, email, credentials }) {
        
      try {
        const emailAddress = profile?.email || email?.email;
        const usuarioExiste = await prisma.user.findUnique({
          where: { email: emailAddress },
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
              return true
            } else {
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
  pages: {
    signIn: '/login',  // Redireciona para a página personalizada de login
  },
});

export default authOptions