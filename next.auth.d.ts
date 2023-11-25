import { type Farm } from "@prisma/client"
import { type DefaultSession, type DefaultUser } from "next-auth"

import { type FarmingDecimals } from "@/types/farming"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string | null
      farm?: Farm | null
      farmingDecimals?: FarmingDecimals | null
    } & DefaultSession["user"]["expires"]
  }

  interface User extends DefaultUser {
    role?: string | null
    farm?: Farm | null
  }
}
