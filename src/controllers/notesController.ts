// models
import User from '../models/User'
import Note from '../models/Note'

import type { Request, Response } from 'express'

export default {
  /**
   * @description Get all notes
   *
   * @route GET /notes
   *
   * @access Private
   */
  getAllNotes: async (req: Request, res: Response) => {
    const notes = await Note.find().lean()

    if (!notes?.length) {
      res.status(400).json({ message: 'No notes found' })
      return
    }

    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user?.username }
      })
    )
    res.json(notesWithUser)
  },

  /**
   * @description Create new note
   *
   * @route GET /notes
   *
   * @access Private
   */
  createNewNote: async (req: Request, res: Response) => {
    const { user, title, text } = req.body

    if (!user) {
      res.status(400).json({ message: 'User is required' })
      return
    }

    if (!title) {
      res.status(400).json({ message: 'Title is required' })
      return
    }

    if (!text) {
      res.status(400).json({ message: 'Text is required' })
      return
    }

    const note = await Note.create({ user, title, text })

    if (note) {
      res.status(201).json({ message: 'New note created' })
    } else {
      res.status(400).json({ message: 'Invalid note data received' })
    }
  },

  /**
   * @description Update a note
   *
   * @route GET /notes
   *
   * @access Private
   */
  updateNote: async (req: Request, res: Response) => {
    const { id, user, title, text, completed } = req.body

    if (!id) {
      res.status(400).json({ message: 'Id is required' })
      return
    }

    if (!user) {
      res.status(400).json({ message: 'User is required' })
      return
    }

    if (!title) {
      res.status(400).json({ message: 'Title is required' })
      return
    }

    if (!text) {
      res.status(400).json({ message: 'Text is required' })
      return
    }

    if (typeof completed !== 'boolean') {
      res.status(400).json({ message: 'Completed is required' })
      return
    }

    const note = await Note.findById(id).exec()
    if (!note) {
      res.status(400).json({ message: 'Note not found' })
      return
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
      res.status(409).json({ message: 'Duplicate note title' })
      return
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()
    res.json(`'${updatedNote.title}' updated`)
  },

  /**
   * @description Delete a note
   *
   * @route DELETE /notes
   *
   * @access Private
   */
  deleteNote: async (req: Request, res: Response) => {
    const { id } = req.body
    if (!id) {
      res.status(400).json({ message: 'Note ID required' })
      return
    }

    const note = await Note.findById(id).exec()
    if (!note) {
      res.status(400).json({ message: 'Note not found' })
      return
    }

    const result = await note.deleteOne()
    const reply = `Note '${result.title}' with ID ${result._id} deleted`
    res.json(reply)
  }
}
