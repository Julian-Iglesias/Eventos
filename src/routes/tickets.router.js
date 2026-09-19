import{Router} from 'express'
import { cancelTicket,getMyTickets } from '../controllers/tickets.controller.js'
import{auth}from '../middlewares/auth.middleware.js'

const router=Router()

router.get('/my-tickets',auth,getMyTickets)
router.patch('/:tid/cancel',auth,cancelTicket)

export default router