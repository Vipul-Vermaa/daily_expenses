import express from 'express'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'
import ErrorMiddleware from './middlewares/Error.js'
import cors from 'cors';

config({ path: './config.env' })  //path to env

const app = express()

// middlewares
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())


import user from './routes/userRoutes.js'
import expense from './routes/expenseRoutes.js'

app.use('/api/v1', user)
app.use('/api/v1', expense)

export default app

app.get('/', (req, res) =>
    res.send(
        `<h1> click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
    )
)

app.use(ErrorMiddleware)