import formidable from "formidable";
import fs from "fs"
import { NextRequest } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"]
const MAX_FILE_SIZE = 300 * 1024 // 300kb

export const ensureUploadDir = () => {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true})
  }
  return uploadDir;
}

export const validateFileType = (mimeType?: string) => {
  return mimeType && ALLOWED_TYPES.includes(mimeType)
}

export const validateFileSize = (size: number) => {
  return size <= MAX_FILE_SIZE;
}

export const renameFile = (tempPath: string, originalFileName?: string) => {
  const ext = path.extname(originalFileName || "");
  const newFileName = `${uuidv4()}${ext}`;
  const uploadDir = ensureUploadDir();
  const newFilePath = path.join(uploadDir, newFileName)

  fs.renameSync(tempPath, newFilePath)
  return `uploads/${newFileName}`;
}

interface FormidableProps {
  fields: formidable.Fields,
  files: formidable.Files
}

export const parseForm = (req: NextRequest) => {
  const form = formidable({
    multiples: true,
    uploadDir: ensureUploadDir(),
    keepExtensions: true,
  });

  return new Promise<FormidableProps>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    })
  })
}