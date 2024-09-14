import prisma from "@/db/dbConnect";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
type loginType = {
  username: string;
  password: string;
};
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials: loginType | undefined): Promise<any> {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username and password are required");
          }

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                {
                  username: credentials?.username,
                },
                {
                  email: credentials?.username,
                },
              ],
            },
          });
          if (!user) {
            throw new Error("Invalid credentials");
          }
          if (user.isVerified == false) {
            throw new Error(
              "User not verified. Please verify your email before login",
            );
          }
          if (!user.password) {
            throw new Error("Please set your password");
          }
          const comparePassword = await bcrypt.compare(
            credentials?.password,
            user.password,
          );

          if (!comparePassword) {
            throw new Error("Invalid credentials");
          }
          // console.log("USER LOGGED IN SUCCESSFULLY");
          // console.log(user);
          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.email = user.email;
      }
      // console.log(
      //   "<--------------------------------------- TOKEN -------------------------->",
      // );
      // console.log(token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
