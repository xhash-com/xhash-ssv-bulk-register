import * as fs from "fs";
import path from "path";

export const readJSON = (filePath: string) => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData.toString());
}

export const pathCheck = (pathString: string) => {
  if (!fs.existsSync(pathString)) {
    fs.mkdirSync(pathString)
  }
}

export const exists = (pathString: string) => {
  return fs.existsSync(pathString)
}

export const getAllFile = (dirPath: string): string[] => {
  const files = fs.readdirSync(dirPath)
  return files.map((value, index) => {
    return path.join(dirPath, value)
  })
}

export const writeFile = (fileName: string, data: string) => {
  fs.writeFileSync(fileName, data)
}


export const deleteAllFiles = (filesPath: string[]) => {
  filesPath.forEach((filePath: string) => {
    fs.unlinkSync(filePath)
  })
}

export const deleteFile = (filePath: string) => {
  fs.unlinkSync(filePath)
}
