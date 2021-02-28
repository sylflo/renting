import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
  userId: number
}

export interface Token {
  userId: number
  type: string
  timestamp: number
}
