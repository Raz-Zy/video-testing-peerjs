import { loginService } from "@/services/auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "haha",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        console.log("Credentials: ", credentials)
        try {
          const res = await loginService(credentials);
          //   console.log("respsone in auth.js: ", res);

          if (res.status != "200 OK"){
            // throw new Error("Failed to login");
            return null;
          }

          return res.payload;
        } catch (error) {
          console.log("Error throw from the auth.js: ", error);
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  // session: {
  //   strategy: "jwt",
  // },
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    async jwt({ token, user }) {
        // console.log("User token: ", user);
        // console.log("token in jwt: ", token);
      if (user) {
        // token.accessToken = user.token;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("Session: ", session);
      // console.log("Token in session: ", token);

      if (token) {
        // session.user = {
        //   ...session.user,
        //   accessToken: token.accessToken,
        // };
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  // logger: {
  //   error(code, ...message) {
  //     // Ignore normal invalid-login noise
  //     if (code === "CredentialsSignin") return;

  //     console.error("[auth][error]", code, ...message);
  //   },
  //   warn(code, ...message) {
  //     console.warn("[auth][warn]", code, ...message);
  //   },
  //   debug(code, ...message) {
  //     console.debug("[auth][debug]", code, ...message);
  //   },
  // },
});
