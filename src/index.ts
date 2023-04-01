import express from 'express';
import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession, { MemoryStore } from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import passportConfig from './passport';
import hpp from 'hpp';
import helmet from 'helmet';

import { MySQLDataSource } from './data-source';
import eventRouter from './routes/event';
import userRouter from './routes/user';
import friendRouter from './routes/friend';
import presetRouter from './routes/preset';

dotenv.config();
const app = express();
const prod: boolean = process.env.NODE_ENV === 'production';

let corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.set('port', prod ? process.env.PORT : 3065);
passportConfig();

// DB connection
MySQLDataSource.initialize()
  .then(() => {
    console.log('MySQL DataSource has been initialized!');
  })
  .catch((err) => {
    console.error('Error during MySQL DataSource Initialization', err);
  });

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(
    cors({
      origin: /friendfee\.com$/,
      credentials: true,
    })
  );
} else {
  //development
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false, //https -> true
      domain: prod ? '.musubi.com' : undefined,
    },
    name: 'session-cookie',
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Add Routers
app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/friend', friendRouter);
app.use('/preset', presetRouter);

app.get('/', (req, res, next) => {
  res.send('Initialized 친구비 Server!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('서버 에러 발생!');
});

app.listen(app.get('port'), () => {
  console.log(`server is running on ${app.get('port')}`);
});
