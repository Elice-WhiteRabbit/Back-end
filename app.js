const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const imageScheduler = require('./src/utils/image-scheduler');

const DBConnection = require('./src/db/db-connection');
const router = require('./src/routers');
require('dotenv').config();

const app = express();

// MongoDB 연결
DBConnection();

// 애플리케이션 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// 라우팅 설정
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: `${err.message}`,
  });
});

// 미사용 이미지파일 정리 스케줄러. *은 순서대로 초/분/시/일/월/요일
// e.g.) 10 30 * * * * : 매일 매시각 30분 10초마다 실행
cron.schedule('0 30 5 * 2', async () => {
    console.log('==============================');
    console.log('매 시각 30분마다 이미지폴더 정리')
    await imageScheduler();
    console.log('==============================');
});

app
  .listen(5000, () => {
    console.log('server start');
  })
  .on('error', (err) => {
    console.log(err);
  });

module.exports = app;
