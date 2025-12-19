import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Session 객체에 user.id 속성을 추가함
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}