import express from 'express';
import { add_Expense, download_Balance_Sheet, individual_User_Expense, overall_Expense } from '../controllers/expenseController.js';
import { isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

// expenses routes
router.route('/addexpense').post(isAuthenticated, add_Expense)
router.route('/userexpense/:id').get(isAuthenticated, individual_User_Expense)
router.route('/overallexpense').get(isAuthenticated, overall_Expense)
router.route('/download').get(isAuthenticated, download_Balance_Sheet)

export default router

