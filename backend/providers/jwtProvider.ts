import { sign, verify } from 'jsonwebtoken'
import { PayloadType } from '../types/payload'

export const signJwt = (payload: PayloadType) => {
  return sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: "1d"}
  )
}

export const verifyJWT = (token: string) => {
  return verify(token, process.env.JWT_SECRET as string)
}