import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

import type { JwtPayload } from 'jsonwebtoken'

export default asyncHandler(async (req, res, next) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    const { UserInfo } = decoded as JwtPayload
    if (!UserInfo) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    const { username, roles } = UserInfo
    if (!username || !roles) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    const payLoad = {
      user: username,
      roles,
    }
    Object.assign(req, payLoad)

    next()
  })
})
