import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// export async function main() {
//   const newUser = await prisma.user.create({
//     data: {
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//     },
//   })
//   console.log(`Created user: ${newUser.name} (ID: ${newUser.id})`)

// }

// function returnAllUsers() {
//   const allUsers = await prisma.user.findMany()
//   console.log(`All users: ${JSON.stringify(allUsers)}`)
// }

// main()
//   .catch((e) => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })