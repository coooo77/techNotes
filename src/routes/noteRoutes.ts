import express from 'express'

import verifyJWT from '../middleware/verifyJWT'
import notesController from '../controllers/notesController'

const router = express.Router()

router.use(verifyJWT)

router.route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote)

export default router
