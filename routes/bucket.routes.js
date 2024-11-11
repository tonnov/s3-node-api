import os from "os";
import Router from "express";
import multer from "multer";
import {
  deleteFile,
  getFile,
  getFileUrl,
  objetosIndex,
  uploadFile,
} from "../controllers/bucket.controller.js";

const router = Router();

const upload = multer({ dest: os.tmpdir() });

router.get("/objetos", objetosIndex);

router.post("/objeto", getFile);

router.post("/objeto-url", getFileUrl);

router.post("/upload", upload.single("file"), uploadFile);

router.post("/delete", deleteFile);

export default router;
