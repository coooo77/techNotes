import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// models
import User from '../models/User'

import type { JwtPayload } from 'jsonwebtoken'
import type { Request, Response } from 'express'

export default {
  /**
   * @description Login
   *
   * @route POST /auth
   *
   * @access Public
   */
  login: async (req: Request, res: Response) => {
    const keys = ['username', 'password']
    for (const key of keys) {
      if (req.body[key]) continue
      res.status(400).json({ message: `filed: ${key} required` })
      return
    }

    const { username, password } = req.body

    const foundUser = await User.findOne({ username }).exec()
    if (!foundUser || !foundUser.active) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })

    // Create secure cookie with refresh token
    // @see @see https://stackoverflow.com/questions/74402197/cookie-in-thunder-client-vs-code-extension
    res.cookie('jwt', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: 'none', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles
    res.json({ accessToken })
  },

  /**
   * @description Refresh
   *
   * @route GET /auth/refresh
   *
   * @access Public - because access token has expired
   */
  refresh: async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.jwt as string

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err, decoded) => {
      if (!decoded) return res.status(403).json({ message: 'Forbidden' })

      const { username } = decoded as JwtPayload
      if (err || !username) return res.status(403).json({ message: 'Forbidden' })

      const foundUser = await User.findOne({ username }).exec()
      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '15m' }
      )

      res.json({ accessToken })
    })
  },

  /**
   * @description Logout
   *
   * @route POST /auth/logout
   *
   * @access Public - just to clear cookie if exists
   */
  logout: async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.jwt as string
    if (!refreshToken) {
      res.sendStatus(204)
      return
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    res.json({ message: 'Cookie cleared' })
  },
}
