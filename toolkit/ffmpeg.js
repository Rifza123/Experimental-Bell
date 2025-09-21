const { default: ff } = await 'fluent-ffmpeg'.import();
const { PassThrough } = await 'stream'.import();
/** !-======[ Experimentall ▪︎ Bell🦋 ]======-!
      https://github.com/Rifza123/Experimental-Bell
      
      * Coding by @rifza.p.p *     
      
      🩵 Follow ️me on :
      ▪︎ https://youtube.com/@rifza  
      ▪︎ https://github.com/Rifza123
      ▪︎ https://instagram.com/rifza.p.p?igshid=ZGUzMzM3NWJiOQ==
      ▪︎ https://www.threads.net/@rifza.p.p
      ▪︎ https://termai.cc
*/

/**
 * Convert buffer media ke format tertentu
 * @param {Buffer} inputBuffer - buffer media input
 * @param {string[]} args - argumen ffmpeg tambahan
 * @param {string} format - output format (default: ogg)
 * @returns {Promise<Buffer>}
 */
export async function processMedia(inputBuffer, args = [], format = "ogg") {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

    const outputStream = new PassThrough();
    const chunks = [];

    const command = ff(inputStream);

    if (format === "ogg") {
      command.audioCodec("libopus");
      command.outputOptions([
        "-vn",
        "-b:a 64k",
        "-ac 2",
        "-ar 48000",
        ...args
      ]);
    } else {
      command.outputOptions(args).format(format);
    }

    command
      .format(format)
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
export async function generateWaveform(inputBuffer, bars = 64, url='https://github.com/Rifza123, https://termai.cc') {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

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
      .pipe() 
      .on("data", chunk => chunks.push(chunk));
  });
}

/**
 * Convert audio buffer ke OGG/Opus (WhatsApp-compatible)
 * @param {Buffer} inputBuffer - Audio source (mp3/wav/m4a/dsb)
 * @returns {Promise<Buffer>} - Buffer hasil ogg/opus
 */
export async function convertToOpus(inputBuffer,url='https://github.com/Rifza123, https://termai.cc') {
  return new Promise((resolve, reject) => {
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const chunks = [];

    inStream.end(inputBuffer);

    ff(inStream)
      .noVideo()
      .audioCodec('libopus')
      .format('ogg')
      .audioBitrate('48k')
      .audioChannels(1)
      .audioFrequency(48000)
      .outputOptions([
        '-map_metadata', '-1',
        '-application', 'voip',
        '-compression_level', '10',
        '-page_duration', '20000'
      ])
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(outStream, { end: true });

    outStream.on('data', c => chunks.push(c));
  });
}

