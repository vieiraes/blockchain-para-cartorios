import express from 'express'
import router from './router.cjs'
import * as ledgerController from '../controllers/ledgerController.js'
// const { registerOnLedger } = require('../controllers/ledgerController.js')


router.post('/register', ledgerController.registerOnLedger)
// router.get('/', ledgerController.listAllLedger)
// router.get('/status', ledgerController.statusLedger)


//router.get('/',)

export { router }

