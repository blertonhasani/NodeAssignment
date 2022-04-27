import * as express from 'express';
import userRouter from './routes/user.route';
import baseRouter from './routes/base.route';
import errorHandler from './middleware/errorHandler';
import errorRouter from './routes/error';

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use('/', baseRouter);
app.use('/user', userRouter);

app.use(errorRouter);
app.use(errorHandler);

export default app;
