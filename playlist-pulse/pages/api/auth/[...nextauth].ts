import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";

console.log("NextAuth file is being loaded");

const options = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: any, account: any }) {
      console.log("JWT callback called", { token, account });
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      console.log("Session callback called", { session, token });
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

console.log("NextAuth options configured", {
  providersConfigured: options.providers.length,
  callbacksConfigured: Object.keys(options.callbacks),
  secretConfigured: !!options.secret
});

export default NextAuth(options);

console.log("NextAuth export completed");