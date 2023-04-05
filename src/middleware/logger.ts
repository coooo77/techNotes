import path from 'path'
import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs, { promises as fsPromises } from 'fs'

import type { Request, Response, NextFunction } from 'express'

const REQUEST_LOG_FILENAME = 'request.log'

export async function logEvents(message: string, logFilename: string) {
  const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  const logContent = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    const logFolderPath = path.join(__dirname, '..', 'logs')

    if (!fs.existsSync(logFolderPath)) {
      await fsPromises.mkdir(logFolderPath, { recursive: true })
    }
    await fsPromises.appendFile(path.join(logFolderPath, logFilename), logContent)
  } catch (error) {
    console.error(error)
  }
}

export function logger(req: Request, res: Response, next: NextFunction) {
  const msg = `${req.method}\t${req.url}\t${req.headers.origin}`
  logEvents(msg, REQUEST_LOG_FILENAME)
  console.log(`method: ${req.method}\tpath: ${req.path}`)
  next()
}
