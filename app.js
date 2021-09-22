const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const inDir = path.join(__dirname, "in");
const outDir = path.join(__dirname, "out");

function extractFileName(filePath) {
  let me = this;
  const symbol = filePath.lastIndexOf("/") === -1 ? "\\" : "/";
  return filePath.slice(filePath.lastIndexOf(symbol) + 1).split(".")[0];
}

(async function () {
  const filesList = await fs.promises.readdir(inDir);
  for (const file of filesList) {
    const fileName = extractFileName(file);
    const outFile = path.join(outDir, fileName + ".png");

    let image;

    try {
      image = await Jimp.read(path.join(inDir, file));
    } catch (error) {
      console.error("Error: ", error.message, "; File: ", file);
      continue;
    }
    // const image = await Jimp.read(path.join(inDir, file));
    const h = image.getHeight();
    const w = image.getWidth();
    if (h > 500 || w > 500) {
      if (h > w) {
        image.resize(Jimp.AUTO, 500);
      }
      if (w > h) {
        image.resize(500, Jimp.AUTO);
      }
      if (w == h) {
        image.resize(500, 500);
      }
    }
    image
      // .resize(256, 256) // resize
      // .quality(90) // set JPEG quality
      .write(outFile); // save
  }
})();
