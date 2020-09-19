import express from 'express';

import bodyParser from 'body-parser';

import pingRouter from './src/routes/ping';
import authRouter from './src/routes/auth';
import profileRouter from './src/routes/profile';
import lobbyRouter from './src/routes/lobby';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/ping", pingRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/lobby", lobbyRouter);

export default app;
