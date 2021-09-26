import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "public",
  "upload",
  "medias"
);

export function loadPublicDir() {
  if (fs.existsSync(PUBLIC_DIR)) {
    return;
  }
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
