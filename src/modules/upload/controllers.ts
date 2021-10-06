import { Handler } from "express";
import { tryCatch, parseIdParam } from "../utils";
import path from "path";
import * as uploadServices from "./services";
import { AppError, ErrorCode } from "../utils/errors";

export const media: Handler = tryCatch(async (req, res) => {
  const { filename } = req.params;

  const upload = await uploadServices.findMedia(filename);

  const rootPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "public",
    "upload",
    "medias"
  );

  res.sendFile(upload.filename, { root: rootPath });
});

export const medias: Handler = tryCatch(async (req, res) => {
  const uploads = await uploadServices.findMedias();

  res.json({ medias: uploads });
});

export const uploadMedia: Handler = tryCatch(async (req, res) => {
  const { file } = req;
  if (!file) {
    throw new AppError(ErrorCode.INVALID_MODEL_DATA, "No File to upload");
  }
  const uploaded = await uploadServices.saveMedia(file!);

  res.status(201).json({
    media: uploaded,
  });
});

export const deleteMedia: Handler = tryCatch(async (req, res) => {
  const id = parseIdParam(req.params.id);

  await uploadServices.deleteMedia(id);

  res.status(204).json();
});
