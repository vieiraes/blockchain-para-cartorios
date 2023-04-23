import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';


export const genesisBlockObject = {
  index: uuidv4(),
  timestamp: new Date(),
  randomBytes: randomBytes(64).toString('hex'),
};