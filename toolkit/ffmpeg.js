const { default: ff } = await 'fluent-ffmpeg'.import();
const { PassThrough } = await 'stream'.import();

/**
 * Apply ffmpeg filter to media buffer
 * @param {Buffer} inputBuffer - media input
 * @param {string[]} args - array argumen filter ffmpeg (tanpa -i dan -f)
 * @param {string} format - output format (default: mp3)
 * @returns {Promise<Buffer>}
 */
export async function processMedia(inputBuffer, args = [], format = "mp3") {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

    const outputStream = new PassThrough();
    const chunks = [];

    ff(inputStream)
      .outputOptions(args)
      .format(format)
      .on("error", reject)
      .on("end", () => resolve(Buffer.concat(chunks)))
      .pipe(outputStream);

    outputStream.on("data", chunk => chunks.push(chunk));
  });
}
