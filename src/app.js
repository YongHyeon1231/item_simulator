import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

// .env 파일을 읽어서 process.env에 추가합니다.
dotenv.config();

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});