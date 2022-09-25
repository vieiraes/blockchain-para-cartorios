import { express, router } from './router.cjs'
 



const { registerOnLedger } = require('../controllers/ledgerController.js')


router.post('/', registerOnLedger)

//router.get('/',)



