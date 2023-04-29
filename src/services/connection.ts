import mongoose from 'mongoose'

export async function connectDB() {
    await mongoose.connect('mongodb://localhost:27027')
    mongoose.set('strictQuery', false)
    const Cat = mongoose.model('Cat', { name: String });

    const kitty = new Cat({ name: 'Zildjian' });
    kitty.save().then(() => console.log('meow'));

}
