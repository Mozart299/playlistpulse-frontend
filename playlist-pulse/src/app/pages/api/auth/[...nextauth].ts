import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { NextApiRequest, NextApiResponse } from "next";

const options = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,

    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: any, account: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
}


export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
