import mongoose from 'mongoose'

export async function connectDB() {
  try {
    if (!process.env.DATABASE_URI) throw Error('No DATABASE_URI available')
    
    await mongoose.connect(process.env.DATABASE_URI)
  } catch (error) {
    console.log(error)
  }
}
