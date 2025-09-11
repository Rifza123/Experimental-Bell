const { default: ff } = await 'fluent-ffmpeg'.import();
const { PassThrough } = await 'stream'.import();

/**
 * Apply ffmpeg filter to media buffer
 * @param {Buffer} inputBuffer - media input
 * @param {string[]} args - array argumen filter ffmpeg (tanpa -i dan -f)
 * @param {string} format - output format (default: mp3, bisa: mp3, mp4, png, jpg, webp)
 * @returns {Promise<Buffer>}
 */
export async function processMedia(inputBuffer, args = [], format = "mp3") {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

    const outputStream = new PassThrough();
    const chunks = [];

    let command = ff(inputStream).inputFormat("image2pipe");

    command.outputOptions(args);

    if (["png", "jpg", "jpeg", "webp"].includes(format)) {
      command = command.format("image2pipe").outputOptions([`-vcodec ${format}`]);
    } else {
      command = command.format(format);
    }

    command
      .on("error", reject)
      .on("end", () => resolve(Buffer.concat(chunks)))
      .pipe(outputStream, { end: true });

    outputStream.on("data", chunk => chunks.push(chunk));
  });
}
