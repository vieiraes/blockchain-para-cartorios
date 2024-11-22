import { Router } from 'express';
import BlockchainController from '../controllers/Blockchain.controllers';

const router = Router();

router.get('/blocks', BlockchainController.getBlocks);
router.post('/blocks', BlockchainController.addBlock);
router.get('/validate', BlockchainController.validateChain);
router.get('/blocks/:index', BlockchainController.getBlockByIndex);

export default router;