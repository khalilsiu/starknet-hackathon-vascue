import { User } from './User'

export type LoginResponseData = {
  accessToken: string,
  user: User
}