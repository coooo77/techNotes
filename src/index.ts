import path from 'path'
import express from 'express'
import root from './routes/root'
import cors from 'cors'
import corsOptions from './config/corsOptions'
import cookieParser from 'cookie-parser'

// middleware
import { logger } from './middleware/logger'

const app = express()

const PORT = process.env.PORT || 3500

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

/**
 * 這個路徑是相對於index.js，所以寫成
 * app.use(express.static(path.join('public')))
 * 也是可以的
 */
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', root)

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

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`))
