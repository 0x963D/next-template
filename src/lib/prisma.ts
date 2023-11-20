import { PrismaClient } from "@prisma/client"

import { IS_PRODUCTION } from "@/config/constants"

// Docs about instantiating `PrismaClient` with Next.js:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

if (IS_PRODUCTION) {
  prisma = new PrismaClient()
} else {
  if (global.prisma === null || global.prisma === undefined) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
