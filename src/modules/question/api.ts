import { Router } from "express";
import {
  addQuestion,
  allQuestions,
  getQuestion,
  removeQuestion,
  updateQuestion,
  random,
} from "./controller";

const router = Router();

router.get("/", allQuestions);

router.post("/", addQuestion); // Admin only

router.get("/random", random);

router.get("/:id", getQuestion);

// Admin Area
router.route("/:id").delete(removeQuestion).patch(updateQuestion);

export default router;
