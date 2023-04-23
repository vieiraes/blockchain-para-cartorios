import mongoose from 'mongoose'

export async function connectDB() {
    // await mongoose.connect('mongodb://admin:admin@172.27.0.2:27027/blockchain')
    await mongoose.connect('mongodb://172.29.0.2:27017/test')
    console.log(mongoose.connection.readyState) 
    connectDB().catch(err => console.error(err))
}