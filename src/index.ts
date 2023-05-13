// external methods
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

// internal methods
import { connectDB } from './config/dbConn'
import corsOptions from './config/corsOptions'

// middleware
import { logger, logEvents } from './middleware/logger'
import { errorHandler } from './middleware/errorHandler'

// routes
import root from './routes/root'
import userRoutes from './routes/userRoutes'
import noteRoutes from './routes/noteRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config({
  path: path.join(__dirname, '..', '.env'),
})
const app = express()
connectDB()
const PORT = process.env.PORT || 3500

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(errorHandler)

/**
 * 這個路徑是相對於index.js，所以寫成
 * app.use(express.static(path.join('public')))
 * 也是可以的
 */
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', root)
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/notes', noteRoutes)

app.all('*', (req, res) => {
  res.status(404)

  // 對應 request 所設定 header 的類型
  const accepts = req.accepts(['html', 'json'])
  switch (accepts) {
    case 'html':
      res.sendFile(path.join(__dirname, 'views', '404.html'))
      break
    case 'json':
      res.json({ message: '404 Not Found' })
      break
    default:
      res.type('txt').send('404 Not Found')
      break
  }
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err)
  const errorMsg = `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`
  logEvents(errorMsg, 'mongoErrLog.log')
})
