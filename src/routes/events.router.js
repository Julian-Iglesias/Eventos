import {Router} from 'express'
import {getEvents, createEvent,updateEvent,updateEventStatus, getEventById} from '../controllers/events.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'
import { createTicket } from '../controllers/tickets.controller.js'


const router = Router()

router.get('/', getEvents)
router.get('/:id',getEventById)
router.post('/',auth,authorize('organizer', 'admin'), createEvent)
router.put('/:id',auth,authorize('organizer','admin'),updateEvent)
router.patch('/:id/status',auth,authorize('organizer','admin'),updateEventStatus)
router.post('/:eid/tickets', auth, createTicket)

export default router