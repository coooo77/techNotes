import path from 'path'
import express from 'express'

const router = express.Router()

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

export default router
