import * as express from 'express';
import { Request, Response, NextFunction, Application } from 'express';

const app: Application = express();
const prod: boolean = process.env.NODE_ENV === 'production';

app.get('/', (req, res) => {
  res.send('Initialized 친구비 Server!');
});

app.listen(prod ? process.env.PORT : 3065, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
