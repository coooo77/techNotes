import express from 'express'
import notesController from '../controllers/notesController'

const router = express.Router()

router.route('/')
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote)

export default router
