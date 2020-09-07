import express from 'express';
import bodyParser from 'body-parser';

import pingRouter from './src/routes/ping'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(pingRouter);

export default app;
