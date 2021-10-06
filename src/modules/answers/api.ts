import { Router } from "express";
import { authController } from "../auth";
import * as answerContoller from "./controller";

const router = Router();

router.get("/", answerContoller.getAll);

router.post("/", authController.isAuth, answerContoller.addAnswer); // Admin only

router.get("/:id", answerContoller.getAnswer);

// Admin only
router
  .route("/:id")
  .all(authController.isAuth)
  .patch(answerContoller.updateAnswer)
  .delete(answerContoller.deleteAnswer);

export default router;
