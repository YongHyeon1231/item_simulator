import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import usersRouter from './routes/users.route.js';
import charactersRouter from './routes/characters.route.js';
import itemsRouter from './routes/items.route.js';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

// .env 파일을 읽어서 process.env에 추가합니다.
dotenv.config();

const app = express();
const PORT = 3018;

app.use(express.json()); // body parser 역할을 해준다.
app.use(cookieParser());

app.use('/api', [usersRouter, charactersRouter, itemsRouter]);

app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
