import { type DefaultSession, type DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string | null
    } & DefaultSession["user"]["expires"]
  }

  interface User extends DefaultUser {
    role?: string | null
  }
}
