// https://github.com/prisma/prisma/discussions/10037
import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_AWS
  })
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL_AWS
    })
  }
  prisma = globalWithPrisma.prisma
}

// prisma.$use(async (params, next) => {
//   if (params.action == "create" && params.model == "Account") {
//     delete params.args.data["not-before-policy"]
//   }

//   const result = await next(params)
//   // See results here
//   return result
// })

export default prisma