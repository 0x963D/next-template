import { PrismaClient, type Prisma } from "@prisma/client"

const prisma = new PrismaClient()

async function main(): Promise<void> {


}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })