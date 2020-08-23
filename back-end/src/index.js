require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import requestIp from 'request-ip';
import mongoose from 'mongoose';
import {APIError, APISuccess} from './middlewares/APIResult';
import session from 'express-session';

const app = express();

// Load global route
import index from './routes/index';

// Database
mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/ooperz'); 

// Application use
app.use(cors());
app.use(helmet());
app.use(session({
   secret: 'K7dj7@17O>S8]Vk6qiuex"dJ4&(_=A)8Ch@p-QlL&/&R+j2G*{)pgN),31ZdSNm',
   resave: false,
   saveUninitialized: true,
   cookie: {secure: true}
}));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(APIError);
app.use(APISuccess);

// Listen routes
app.use('/', index);

// Application listener
app.listen(process.env.PORT, () => {
   console.log(`Le serveur est ouvert sur le port ${process.env.PORT}`);
});