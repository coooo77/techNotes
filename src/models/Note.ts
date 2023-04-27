/**
 * @see https://github.com/ramiel/mongoose-sequence
 * @see https://github.com/ramiel/mongoose-sequence/issues/111
 */
import mongoose, { Document, Schema } from 'mongoose'
// import AutoIncrementFactory from 'mongoose-sequence';

// const AutoIncrement = AutoIncrementFactory(mongoose)

interface INote extends Document {
  user: mongoose.Types.ObjectId
  title: string
  text: string
  completed: boolean
}

const noteSchema = new Schema<INote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// noteSchema.plugin(AutoIncrement, {
//   inc_field: 'ticket',
//   id: 'ticketNums',
//   start_seq: 500
// });

const Note = mongoose.model<INote>('Note', noteSchema)

export default Note
