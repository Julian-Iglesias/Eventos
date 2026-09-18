import{Router} from 'express'
import { createTicket } from '../controllers/tickets.controller.js'
import{auth}from '../middlewares/auth.middleware.js'

const router=Router()
router.post('/event/:eid/tickets',auth,createTicket)

export default router