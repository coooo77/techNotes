import express from 'express'
import usersController from '../controllers/usersController'

const router = express.Router()

router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

export default router