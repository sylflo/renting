import { PrismaClient } from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'
import { tokens } from './utils/constants'
import { Context, Token } from './types'

const handleError = (error: Error): Error => {
  // add any other logging mechanism here e.g. Sentry
  throw error
}

const generateAccessToken = (userId: number): null | string => {
  if (!process.env.APP_SECRET) {
    return null
  }
  const accessToken = sign(
    {
      userId,
      type: tokens.access.name,
      timestamp: Date.now(),
    },
    process.env.APP_SECRET,
    {
      expiresIn: tokens.access.expiry,
    },
  )
  return accessToken
}

const prisma = new PrismaClient({
  log: ['error'],
})

// eslint-disable-next-line
const createContext = (ctx: any): Context => {
  let userId: number
  try {
    let Authorization = ''
    try {
      // for queries and mutations
      Authorization = ctx.req.get('Authorization')
    } catch (e) {
      // specifically for subscriptions as the above will fail
      Authorization = ctx?.connection?.context?.Authorization
    }
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(
      token,
      process.env.APP_SECRET as string,
    ) as Token

    if (!verifiedToken.userId && verifiedToken.type !== tokens.access.name)
      userId = -1
    else userId = verifiedToken.userId
  } catch (e) {
    userId = -1
  }
  return {
    ...ctx,
    prisma,
    userId,
  }
}

export { handleError, generateAccessToken, Context, prisma, createContext }
