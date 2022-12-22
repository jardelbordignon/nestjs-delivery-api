import type { Request } from 'express'

interface IUser {
  id: string
  name: string
}

export interface RequestWithUser extends Request {
  user: IUser
}
