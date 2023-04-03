import path from 'path'
import express from 'express'
import root from './routes/root'

const app = express()

const PORT = process.env.PORT || 3500

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
