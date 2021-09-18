import { Router } from "express";
import * as answerContoller from "./controller";

const router = Router();

router.get("/", answerContoller.getAll);

router.post("/", answerContoller.addAnswer); // Admin only

router.get("/:id", answerContoller.getAnswer);

// Admin only
router
  .route("/:id")
  .patch(answerContoller.updateAnswer)
  .delete(answerContoller.deleteAnswer);

export default router;
