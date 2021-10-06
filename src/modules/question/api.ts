import { Router } from "express";
import { authController } from "../auth";
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

router.post("/", authController.isAuth, addQuestion); // Admin only

router.get("/random", random);

router.get("/:id", getQuestion);

// Admin Area
router
  .route("/:id")
  .all(authController.isAuth)
  .delete(removeQuestion)
  .patch(updateQuestion);

export default router;
