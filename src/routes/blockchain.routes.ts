import { Router } from 'express';
import BlockchainController from '../controllers/Blockchain.controller';

const router = Router();

router.get('/blocks', BlockchainController.getBlocks);
router.post('/blocks', BlockchainController.addBlock);
router.get('/validate', BlockchainController.validateChain);

export default router;