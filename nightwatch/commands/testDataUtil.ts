import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const path = require("path");

export function getTestDocumentPathByType(documentExtension: string) {
  return path.resolve(
    __dirname + "../../../test_data/sampleDocument." + documentExtension,
  );
}

export function getPdfTestDocumentPath() {
  return getTestDocumentPathByType("pdf");
}

export function getFileNameWithExtensionFromPath(filePath: string) {
  return path.parse(filePath).base;
}

export function getPdfFileNameWithExtension() {
  return getFileNameWithExtensionFromPath(getPdfTestDocumentPath());
}

export function getFileNameWithoutExtensionFromPath(filePath: string) {
  return path.parse(filePath).name;
}

export function checkFileExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    console.log("Using file from path:" + filePath);
  } else {
    throw new Error("File not found :" + filePath);
  }
}

export function cleanupDownloadFolder() {
  const { readdirSync, rmSync } = require("fs");
  const downloadFolder = path.resolve(__dirname + "/../../download");
  try {
    console.log("Files in the download folder: ", readdirSync(downloadFolder));
    readdirSync(downloadFolder).forEach((file) =>
      rmSync(`${downloadFolder}/${file}`),
    );
  } catch (ex) {
    console.error("Failed to clean up the download folder :", ex);
  }
}

export function generateUUID() {
  return uuidv4();
}

export function generateDocumentTitleTimeStamp() {
  return "docAQA" + Date.now();
}

export function getRandomInt(maxBound: number) {
  return Math.floor(Math.random() * maxBound);
}
