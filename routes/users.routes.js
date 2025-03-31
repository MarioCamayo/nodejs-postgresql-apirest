import { Router } from 'express'
import { createUser, getUsers, deleteUser, updateUser, getUser} from '../controllers/users.controller.js';

const router = Router() 

//  Obtener todos los usuarios
router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.put('/users/:userId', updateUser)
router.delete('/users/:userId', deleteUser)


export default router




  