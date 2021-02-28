import { compare } from 'bcrypt'
import { stringArg, extendType, nonNull, objectType, queryField } from 'nexus'
import { User } from '@prisma/client'
import { generateAccessToken, handleError } from '../../context'
import { errors } from '../../utils/constants'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.createdAt()
    t.model.id()
    t.model.name()
    t.model.email()
  },
})

const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('accessToken')
    t.field('user', { type: 'User' })
  },
})

const me = queryField('me', {
  type: 'User',
  resolve: async (_parent, _args, ctx) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
    })
    return user
  },
})

const MutationUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (root, args, ctx) => {
        const { email, password } = args
        let user: User | null = null
        try {
          user = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
          })
        } catch (e) {
          handleError(errors.invalidUser)
        }

        if (!user) {
          throw handleError(errors.invalidUser)
        }

        const passwordValid = await compare(password, user.password)
        if (!passwordValid) handleError(errors.invalidUser)

        const accessToken = generateAccessToken(user.id)
        return {
          accessToken,
          user,
        }
      },
    })
  },
})

export { me, AuthPayload, User, MutationUser }
