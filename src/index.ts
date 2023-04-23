import express from 'express'
import mongoose from 'mongoose'
import { router } from './router'
import { generateGenesisBlock } from './genesisBlock'
import { genesisBlockObject } from '../utils/generateBlock'

try {
  mongoose.set('strictQuery', false)
  mongoose.connect('mongodb://localhost:27017/db_blockchain', { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      const app = express()
      const port = 3333

      app.use(express.json()) //tem que usar sempre antes do router
      app.use(router)
      generateGenesisBlock()
      app.listen(3333, () => {
        console.log(`Server started on port ${port}!`)
      })
      console.log('Connected to DB')
    })
} catch (error) {
  console.log('erro ao conectar', error)
}