import { hash } from 'bcrypt'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const createUser = async (email, password, fullname) => {
  try {
    const hashedPassword = await hash(password, 10)
    const res = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: fullname,
      },
    })
    console.log(res)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

const main = async () => {
  if (process.argv.length !== 5) {
    console.error(
      'Usage  node ./backend/src/commands/admin.js email password fullname',
    )
    process.exit(-1)
  }
  const args = process.argv.slice(2)
  await createUser(args[0], args[1], args[2])
}

main()
  .then(() => {
    console.log('User created')
  })
  .catch((e) => {
    console.error(e)
  })
