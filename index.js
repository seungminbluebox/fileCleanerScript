const fs = require("fs");
const path = require("path");
const os = require("os");

const args = process.argv.slice(2);
const customArg = args[0];

const rootPath = path.join(
  os.homedir(),
  "OneDrive",
  "바탕 화면",
  `${customArg}`
);

function move(typePath, file) {
  const oldPath = path.join(rootPath, file);
  const newPath = path.join(typePath, file);
  const dirPath = path.dirname(newPath);
  const dirName = path.basename(dirPath);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${file} move to ${dirName}`);
  });
}

const videoDirPath = path.join(rootPath, "video");
const capturedDirPath = path.join(rootPath, "captured");
const duplicatedDirPath = path.join(rootPath, "duplicated");
const arr = [videoDirPath, capturedDirPath, duplicatedDirPath];

for (let i of arr) {
  fs.mkdir(i, { recursive: true }, (err) => {
    if (err) {
      console.error(` 폴더 생성 중 오류 발생:`, err);
      return;
    }
    const dirName = path.basename(i);
    console.log(`${dirName}폴더 생성 성공!`);
  });
}

fs.readdir(rootPath, (err, files) => {
  if (err) {
    console.error("폴더를 읽는 중 오류 발생:", err);
    return;
  }
  const duplArray = [];
  files.forEach((file) => {
    const extension = path.extname(file);
    if (extension === ".png" || extension === ".aae") {
      move(capturedDirPath, file);
    } else if (extension === ".mp4" || extension === ".mov") {
      move(videoDirPath, file);
    } else if (extension === ".jpg") {
      if (!file.includes("E")) {
        const [ext, num] = file.split("_");
        duplArray.push(num);
      }
      if (file.includes("E")) {
        const [ext, num] = file.split("_E");
        if (duplArray.includes(num)) {
          const duplFileName = ext + "_" + num;
          move(duplicatedDirPath, duplFileName);
        }
      }
    }
  });
});
