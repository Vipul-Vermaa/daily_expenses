import { Expense } from '../models/expenseModel.js'
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import { User } from '../models/userModel.js';
import PDFDocument from 'pdfkit';
import { splitEqually, splitExact, splitByPercentage } from '../utils/splitLogic.js'

// adding expense
export const add_Expense = catchAsyncError(async (req, res, next) => {
    const { amount, participants, splitType } = req.body;

    if (!amount || !participants || !splitType) {
        return next(new ErrorHandler('Enter all fields', 400))
    }
    if (!Array.isArray(participants) || participants.length === 0) {
        return next(new ErrorHandler('Participants must be a non-empty array', 400));
    }
    const validSplitTypes = ['equal', 'exact', 'percentage']
    if (!validSplitTypes.includes(splitType)) {
        return next(new ErrorHandler(`Invalid split type. Must be one of: ${validSplitTypes.join(', ')}`, 400));
    }

    let splitParticipants;
    try {
        if (splitType === 'equal') {
            splitParticipants = splitEqually(amount, participants);
        } else if (splitType === 'exact') {
            splitParticipants = splitExact(participants);
        } else if (splitType === 'percentage') {
            splitParticipants = splitByPercentage(amount, participants);
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
    const expense = await Expense.create({
        amount,
        participants: splitParticipants,
        splitType
    })
    res.status(201).json({
        success: true,
        message: 'Expense added',
        expense
    })
})

// individual user expense
export const individual_User_Expense = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler('user not found', 404))
    const expenses = await Expense.find({
        "participants.user": id
    });
    const totalExpense = expenses.reduce((total, expense) => {
        const participant = expense.participants.find(p => p.user.toString() === id);
        return total + (participant ? participant.amount_owed : 0);
    }, 0);
    res.status(200).json({
        success: true,
        totalExpense
    })
})

// overall expense
export const overall_Expense = catchAsyncError(async (req, res, next) => {
    const expenses = await Expense.find().populate('participants.user', 'name email');

    if (!expenses || expenses.length === 0) return next(new ErrorHandler('No expenses found', 404));

    const totalAmount = expenses.reduce((total, expense) => {
        return total + expense.amount;
    }, 0);

    const userExpenses = {};

    expenses.forEach(expense => {
        expense.participants.forEach(participant => {

            if (!participant.user) {
                console.warn('Participant user is null for expense ID:', expense._id);
                return;
            }

            const userId = participant.user._id.toString();
            const amountOwed = participant.amount_owed;


            if (amountOwed == null) {
                console.warn('Amount owed is null for participant in expense ID:', expense._id);
                return;
            }

            if (userExpenses[userId]) {
                userExpenses[userId].totalOwed += amountOwed;
            } else {
                userExpenses[userId] = {
                    name: participant.user.name,
                    email: participant.user.email,
                    totalOwed: amountOwed
                };
            }
        });
    });

    res.status(200).json({
        success: true,
        totalAmount,
        userExpenses,
        expenses
    });
});



// downloading balance sheet
export const download_Balance_Sheet = catchAsyncError(async (req, res, next) => {

    const individual_expenses = await individual_User_Expense
    const overall_expenses = await overall_Expense

    const doc = new PDFDocument()
    res.setHeader('Content-disposition', 'attachment; filename=balance-sheet.pdf');
    res.setHeader('Content-type', 'application/pdf')

    doc.pipe(res)

    doc.fontSize(25).text('Balance Sheet', { align: 'center' });

    doc.text(`Individual expenses: $${individual_expenses.totalSpent.toFixed(2)}`, { align: 'left' });
    doc.text(`Overall expenses: $${overall_expenses.totalOwed.toFixed(2)}`, { align: 'left' });
    doc.text(`Net Balance: balance`);

    doc.end();
})