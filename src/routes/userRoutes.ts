import express from 'express'
import verifyJWT from '../middleware/verifyJWT'

import usersController from '../controllers/usersController'

const router = express.Router()

router.use(verifyJWT)

router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

export default router