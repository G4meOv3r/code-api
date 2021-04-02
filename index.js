import express from 'express'
import socket from 'socket.io'
import http from 'http'
import path from 'path'

import cors from 'cors'
import bodyParser from 'body-parser'

import authRouter from './src/routes/auth'
import profileRouter from './src/routes/profile'

import onConnection from './src/events'

// express
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/auth', authRouter)
app.use('/profile', profileRouter)

app.use(express.static(path.join(__dirname, 'public')))
const httpServer = new http.Server(app)

// socket.io
new socket.Server(httpServer, { cors: { origin: '*' } })
    .use((socket, next) => { console.log('middleware'); next() })
    .on('connection', onConnection)

export default httpServer
