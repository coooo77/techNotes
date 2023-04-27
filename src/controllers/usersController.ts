import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'

// models
import User from '../models/User'
import Note from '../models/Note'

export default {
  /**
   * @description Get all users
   *
   * @route GET /users
   *
   * @access Private
   */
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()

    if (!users.length) {
      res.status(400).json({ message: 'No users found' })
    } else {
      res.json(users)
    }
  }),

  /**
   * @description Create new user
   *
   * @route POST /users
   *
   * @access Private
   */
  createNewUser: asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    if (!username) {
      res.status(400).json({ message: 'Username is required' })
      return
    }

    if (!password) {
      res.status(400).json({ message: 'Password is required' })
      return
    }

    if (!Array.isArray(roles) || !roles.length) {
      res.status(400).json({ message: 'roles is required' })
      return
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
      res.status(409).json({ message: 'Duplicate username' })
      return
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObj = { username, password: hashedPwd, roles }
    const user = await User.create(userObj)

    if (user) {
      res.status(201).json({ message: `New user ${username} created` })
    } else {
      res.status(400).json({ message: 'Invalid user data received' })
    }
  }),

  /**
   * @description Update a user
   *
   * @route PATCH /users
   *
   * @access Private
   */
  updateUser: asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    if (!id) {
      res.status(400).json({ message: 'Id is required' })
      return
    }

    if (typeof active !== 'boolean') {
      res.status(400).json({ message: 'Active is required' })
      return
    }

    if (!username) {
      res.status(400).json({ message: 'Username is required' })
      return
    }

    if (!password) {
      res.status(400).json({ message: 'Password is required' })
      return
    }

    if (!Array.isArray(roles) || !roles.length) {
      res.status(400).json({ message: 'roles is required' })
      return
    }

    const user = await User.findById(id).exec()
    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
      res.status(409).json({ message: 'Duplicate username' })
      return
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated` })
  }),

  /**
   * @description Delete a user
   *
   * @route DELETE /users
   *
   * @access Private
   */
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
      res.status(400).json({ message: 'User ID Required' })
      return
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
      res.status(400).json({ message: 'User has assigned notes' })
      return
    }

    const user = await User.findById(id).exec()
    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
  }),
}
