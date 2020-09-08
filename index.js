import express from 'express';

import bodyParser from 'body-parser';

import pingRouter from './src/routes/ping';
import authRouter from './src/routes/auth';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/ping", pingRouter);
app.use("/auth", authRouter);

export default app;
