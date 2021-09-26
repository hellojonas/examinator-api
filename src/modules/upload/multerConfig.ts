import multer, { diskStorage } from "multer";
import { customAlphabet } from "nanoid";
import path from "path";
import { AppError, ErrorCode } from "../utils/errors";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
  10
);

const PUBLIC_DIR = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "public",
  "upload",
  "medias"
);

const storage = diskStorage({
  filename(_, file, cb) {
    const id = nanoid();
    const ext = file.mimetype.split("/")[1];

    // console.log(`${PUBLIC_DIR}/media-${id}.${ext}`);
    cb(null, `media-${id}.${ext}`);
  },
  destination(_, _2, cb) {
    return cb(null, PUBLIC_DIR);
  },
});

export const multerConfig = multer({
  storage,
  fileFilter(_, file, cb) {
    const ext = file.mimetype.split("/")[1];

    if (["jpg", "jpeg", "png"].includes(ext)) {
      cb(null, true);
      return;
    }

    cb(new AppError(ErrorCode.INVALID_MODEL_DATA, "Invalid media filetype"));
  },
});
