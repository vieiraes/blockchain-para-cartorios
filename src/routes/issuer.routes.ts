import { Router } from 'express';
import IssuerController from '../controllers/Issuer.controlles';

const router = Router();

router.post('/', IssuerController.createIssuer);
router.post('/accreditation', IssuerController.accreditIssuer);
router.get('/:id', IssuerController.getIssuer);
router.get('/', IssuerController.getAllIssuers);
router.post('/generate-hash', IssuerController.generateHash);


export default router;