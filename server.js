import express, { urlencoded } from 'express'
import bodyParser from 'body-parser';


const app = express();

export function startServer() {
  const port = 3000;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))

}

app.get('/status', (req, res) => res.send('status ok!'))
