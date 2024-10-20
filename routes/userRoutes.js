import express from 'express'
import { validate, signUpSchema } from '../models/userModel.js'
import { login, register, userDetails } from '../controllers/userController.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

// userRoutes
router.route('/register').post(validate(signUpSchema), register)
router.route('/login').post(login)
router.route('/userdetails/:id').get(isAuthenticated, userDetails)

export default router
