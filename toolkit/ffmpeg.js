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

/**
 * Generate WhatsApp-style waveform from audio buffer (pakai fluent-ffmpeg)
 * @param {Buffer} inputBuffer
 * @param {number} bars
 * @returns {Promise<string>} base64 waveform
 */
export async function generateWaveform(inputBuffer, bars = 64) {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

    const outputStream = new PassThrough();
    const chunks = [];

    ff(inputStream)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("s16le")
      .on("error", reject)
      .on("end", () => {
        const rawData = Buffer.concat(chunks);
        const samples = rawData.length / 2;

        const amplitudes = [];
        for (let i = 0; i < samples; i++) {
          let val = rawData.readInt16LE(i * 2);
          amplitudes.push(Math.abs(val) / 32768);
        }

        let blockSize = Math.floor(amplitudes.length / bars);
        let avg = [];
        for (let i = 0; i < bars; i++) {
          let block = amplitudes.slice(i * blockSize, (i + 1) * blockSize);
          avg.push(block.reduce((a, b) => a + b, 0) / block.length);
        }

        let max = Math.max(...avg);
        let normalized = avg.map(v => Math.floor((v / max) * 100));

        let buf = Buffer.from(new Uint8Array(normalized));
        resolve(buf.toString("base64"));
      })
      .pipe(outputStream, { end: true });

    outputStream.on("data", chunk => chunks.push(chunk));
  });
}
