import express from "express";
import {
  createBatch,
  addStudentsToBatch,
  getAllBatches,
} from "../controllers/batch.controller.js";

const router = express.Router();

router.post("/create", (req, res) => {
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers.authorization);

  createBatch(req, res);
});

router.post("/add-students", (req, res) => {
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers.authorization);

  addStudentsToBatch(req, res);
});

router.get("/", (req, res) => {
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers.authorization);

  getAllBatches(req, res);
});

export default router;
