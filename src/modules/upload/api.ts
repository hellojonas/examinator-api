import { Router } from "express";
import * as uploadController from "./controllers";
import { multerConfig } from "./multerConfig";

const router = Router();

const uploadSingle = multerConfig.single("media");

router
  .route("/")
  .get(uploadController.medias)
  .post(uploadSingle, uploadController.uploadMedia);

router.get("/:filename", uploadController.media);

router.delete("/:id", uploadController.deleteMedia);

export default router;
