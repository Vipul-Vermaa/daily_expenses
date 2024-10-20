import mongoose from "mongoose";

// connection with database
export const connectDB = async () => {
    const { connection } = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Database connected with ${connection.host}`)
}