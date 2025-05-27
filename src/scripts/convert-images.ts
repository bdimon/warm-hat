import sharp from "sharp";
import fs from "fs";
import path from "path";

const sourceDir = path.resolve("originals");
const outputDir = path.resolve("converted/images");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs
  .readdirSync(sourceDir)
  .filter((file) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file));

files.forEach((file) => {
  const inputPath = path.join(sourceDir, file);
  const outputFileName = path.basename(file, path.extname(file)) + ".webp";
  const outputPath = path.join(outputDir, outputFileName);

  sharp(inputPath)
    .resize(800, 400, {
      fit: 'cover', // Обрезка по центру
      position: 'center',
    })
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(() => console.log('✔️', outputFileName))
    .catch((err) => console.error('❌ Ошибка:', err));
    // console.log("Converting", inputPath, "to", outputPath);
});
