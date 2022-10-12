import express from 'express'
import bodyParser from 'body-parser';
// import { compare } from './middleware/compareHashes.js'

export const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());


export function startServer() {
  const port = 3000;

  app.listen(port, () => console.log(`App listening on port ${port}!`))

}