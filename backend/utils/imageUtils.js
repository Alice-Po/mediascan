import sharp from 'sharp';

/**
 * Compresse et redimensionne une image à 128x128px, max 50ko, format JPEG.
 * @param {Buffer} inputBuffer - L'image d'origine
 * @returns {Promise<Buffer>} - L'image compressée
 * @throws {Error} - Si impossible de compresser sous 50ko
 */
export async function compressAndResizeImage(inputBuffer) {
  let outputBuffer = await sharp(inputBuffer)
    .resize(128, 128, { fit: 'cover' })
    .toFormat('jpeg', { quality: 80 })
    .toBuffer();

  let quality = 80;
  while (outputBuffer.length > 50 * 1024 && quality > 30) {
    quality -= 10;
    outputBuffer = await sharp(inputBuffer)
      .resize(128, 128, { fit: 'cover' })
      .toFormat('jpeg', { quality })
      .toBuffer();
  }
  if (outputBuffer.length > 50 * 1024) {
    throw new Error("Impossible de compresser l'avatar sous 50ko");
  }
  return outputBuffer;
}

