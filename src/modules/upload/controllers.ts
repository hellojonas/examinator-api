import { Handler } from "express";
import { tryCatch, parseIdParam } from "../utils";
import path from "path";
// import { ErrorCode, AppError } from "../utils/errors";
import * as uploadServices from "./services";

export const media: Handler = tryCatch(async (req, res) => {
  const { filename } = req.params;

  const upload = await uploadServices.findMedia(filename);

  // res.json({ media: upload });
  const rootPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "public",
    "upload",
    "medias"
    // upload.filename
  );

  res.sendFile(upload.filename, { root: rootPath });
});

export const medias: Handler = tryCatch(async (req, res) => {
  const uploads = await uploadServices.findMedias();

  res.json({ medias: uploads });
});

export const uploadMedia: Handler = tryCatch(async (req, res) => {
  const { file } = req;
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
