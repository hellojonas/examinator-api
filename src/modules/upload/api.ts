import { Router } from "express";
import { authController } from "../auth";
import * as uploadController from "./controllers";
import { multerConfig } from "./multerConfig";

const router = Router();

const uploadSingle = multerConfig.single("media");

router
  .route("/")
  .get(uploadController.medias)
  .post(authController.isAuth, uploadSingle, uploadController.uploadMedia);

router.get("/:filename", uploadController.media);

router.delete("/:id", authController.isAuth, uploadController.deleteMedia);

export default router;
