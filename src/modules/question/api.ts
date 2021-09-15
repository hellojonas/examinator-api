import { Router } from "express";
import {
  addQuestion,
  allQuestions,
  getQuestion,
  removeQuestion,
  updateQuestion,
} from "./controller";

const router = Router();

router.get("/", allQuestions);
router.get("/:id", getQuestion);

// Admin Area
router
  .route("/:id")
  .delete(removeQuestion)
  .patch(updateQuestion)
  .post(addQuestion);

export default router;
