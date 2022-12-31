import multer from "multer";
import { BadRequestError } from "../request-errors/index.js";

//storage setup
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const checkFileType = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new BadRequestError("Only image files are accepted!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 3500000 }, // 3.5MB
  fileFilter: checkFileType,
});

export default upload;
