import { logEvents } from './logger'

import type { Request, Response, NextFunction } from 'express'

const ERROR_LOG_FILENAME = 'errLog.log'

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  const msg = `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`

  logEvents(msg, ERROR_LOG_FILENAME)

  const status = res.statusCode || 500

  res.status(status)

  res.json({ message: error.message })
}
