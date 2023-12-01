const multer = require('multer');
const fs = require('fs');
const stringDate = require('./date-to-string');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
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

const upload = multer({ storage, fileFilter, limits: { fileSize: 30 * 1024 * 1024 }, });

function imageToURL(req, res, next) {
  const uploadDir = './public/images';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  upload.single('image')(req, res, (err) => {
    if (err) {
      throw err;
    }

    const imagePath = `/images/${req.file.filename}`;
    res.status(200).json({
        message: "이미지 url 생성",
        data: imagePath
    })
  });
}

const deleteImage = async (imageURL) => {
  try{
      const path = 'public/images' + imageURL.split('images')[1];

      await fs.promises.unlink(path);
  } catch(err) {
      if(err.code === 'ENOENT'){
        console.log("파일이 이미 존재하지 않음");
      }else{
        throw err;
      }
  }
}

module.exports = {
  imageToURL,
  deleteImage
};