import mongoose, { Document, Schema } from 'mongoose'

interface IUser extends Document {
  username: string
  password: string
  roles: string[]
  active: boolean
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ['Employee'],
  },
  active: {
    type: Boolean,
    default: true,
  },
})

const User = mongoose.model<IUser>('User', userSchema)

export default User
