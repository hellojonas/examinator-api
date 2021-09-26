import { MulterFile } from "src/types";
import { FindManyOptions, FindOneOptions, getRepository } from "typeorm";
import { ValidationError } from "yup";
import {
  AppError,
  ErrorCode,
  InvalidModelData,
  RecordNotFound,
} from "../utils/errors";
import Upload from "./Upload.entity";
import fs from "fs";
import path from "path";

export async function saveMedia(file: MulterFile): Promise<Upload> {
  const { filename } = file;

  if (!file) {
    throw new AppError(ErrorCode.INVALID_MODEL_DATA, "No file to upload");
  } else if (!filename || filename.length === 0) {
    throw new ValidationError("Media filename has invalid value");
  }

  try {
    const uploaded = await getRepository(Upload).save({ filename });

    return uploaded;
  } catch (error) {
    const err = new AppError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to upload media, try again later"
    );
    err.cause = error;
    throw error;
  }
}

export async function deleteMedia(id: number) {
  const repository = getRepository(Upload);

  const upload = await repository.findOne(id);

  if (!upload) {
    throw new RecordNotFound("No media was found");
  }

  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "public",
    "upload",
    "medias",
    upload.filename
  );

  console.log(filePath);

  try {
    await fs.promises.unlink(filePath);

    const deleted = await repository.remove(upload);

    return deleted;
  } catch (error) {
    const err = new AppError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to upload media, try again later"
    );
    err.cause = error;
    throw err;
  }
}

export async function findMedias(option?: FindManyOptions) {
  try {
    const uploads = await getRepository(Upload).find(option);

    return uploads;
  } catch (error) {
    const err = new AppError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to upload media, try again later"
    );
    err.cause = error;
    throw err;
  }
}

export async function findMedia(filename: string) {
  try {
    const upload = await getRepository(Upload).findOne({ filename });

    if (!upload) {
      throw new RecordNotFound("Media not Found");
    }

    return upload;
  } catch (error) {
    if ((error as Error).name === "RecordNotFound") {
      throw error;
    }
    const err = new AppError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to fetch media, try again later"
    );
    err.cause = error;
    throw err;
  }
}
