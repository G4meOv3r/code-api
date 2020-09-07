import express from 'express';

import pingController from "../controllers/ping";


const ping = express.Router();
ping.get('/ping', pingController.ping);

export default ping;