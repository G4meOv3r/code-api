import express from 'express'
import socket from 'socket.io'
import http from 'http'
import path from 'path'

import cors from 'cors'
import bodyParser from 'body-parser'

import authRouter from './src/routes/auth'
import profileRouter from './src/routes/profile'
import contestRouter from './src/routes/contest'
import taskRouter from './src/routes/task'
import packageRouter from './src/routes/package'
import searchRouter from './src/routes/search'

import authMiddleware from './src/middlewares/auth/auth'

import onConnection from './src/events/connection'

// express
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/contest', contestRouter)
app.use('/task', taskRouter)
app.use('/package', packageRouter)
app.use('/search', searchRouter)

app.use(express.static(path.join(__dirname, 'public')))
const httpServer = new http.Server(app)

// socket.io
new socket.Server(httpServer, { cors: { origin: '*' } })
    .use(authMiddleware.user.ws)
    .on('connection', onConnection)

export default httpServer
