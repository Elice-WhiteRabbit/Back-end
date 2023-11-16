const multer = require('multer');
const stringDate = require('./date-to-string');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/temp');
    },
    filename: (req, file, cb) => {
      cb(null, stringDate(new Date()) + '-' + file.originalname);
    }
  });

const fileFilter = (req, file, cb) => {
    // 확장자 필터링
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true); // 해당 mimetype만 받겠다는 의미
    } else {
      throw {
        status: 400,
        message: "jpg,jpeg,png 파일만 업로드 가능합니다."
      }
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 }, });

function imageToURL(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      throw err;
    }
    // 서버 주소. 배포시엔 도메인 주소로 바꿔야함
    const address = 'http://localhost:5000'

    const imagePath = `${address}/temp/${req.file.filename}`;
    res.status(200).json({
        message: "이미지 url 생성",
        data: imagePath
    })
  });
}

module.exports = { imageToURL };