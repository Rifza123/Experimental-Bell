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

import fs from 'fs';

/**
 * processMedia
 * - input: Buffer | string (filepath)
 * - output:
 *    - return Buffer (default)
 *    - atau tulis ke file jika outputPath diberikan
 *
 * @param {Buffer|string} input
 * @param {string[]} args
 * @param {string} format
 * @param {string|null} outputPath
 * @returns {Promise<Buffer|void>}
 */
export async function processMedia(
  input,
  args = [],
  format = 'mp3',
  outputPath = null
) {
  return new Promise((resolve, reject) => {
    let command;
    if (typeof input == 'string')
      outputPath = input.replace(
        input.split('/').last(),
        'output_' + input.split('/').last()
      );

    if (Buffer.isBuffer(input)) {
      const inputStream = new PassThrough();
      inputStream.end(input);
      command = ff(inputStream);
    } else if (typeof input === 'string') {
      if (!fs.existsSync(input)) {
        return reject(new Error(`Input file not found: ${input}`));
      }
      command = ff(input);
    } else {
      return reject(new Error('Invalid input type (Buffer | filepath only)'));
    }

    if (Array.isArray(args) && args.length > 0) {
      command.outputOptions(args);
    }

    if (['png', 'jpg', 'jpeg', 'webp'].includes(format)) {
      command
        .videoCodec(format === 'jpg' ? 'mjpeg' : format)
        .format('image2pipe')
        .outputOptions(['-frames:v', '1']);
    } else {
      command.format(format);
    }

    if (outputPath && typeof outputPath === 'string') {
      command
        .on('error', reject)
        .on('end', () => resolve(outputPath))
        .save(outputPath);
      return;
    }

    const outputStream = new PassThrough();
    const chunks = [];

    command
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(outputStream, { end: true });

    outputStream.on('data', (chunk) => chunks.push(chunk));
  });
}

/**
 * Generate WhatsApp-style waveform from audio buffer (pakai fluent-ffmpeg)
 * @param {Buffer} inputBuffer
 * @param {number} bars
 * @returns {Promise<string>} base64 waveform
 */
export async function generateWaveform(
  inputBuffer,
  bars = 64,
  url = 'https://github.com/Rifza123, https://termai.cc'
) {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

    const chunks = [];

    ff(inputStream)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('s16le')
      .on('error', reject)
      .on('end', () => {
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
        let normalized = avg.map((v) => Math.floor((v / max) * 100));

        let buf = Buffer.from(new Uint8Array(normalized));
        resolve(buf.toString('base64'));
      })
      .pipe()
      .on('data', (chunk) => chunks.push(chunk));
  });
}

/**
 * Convert audio buffer ke OGG/Opus (WhatsApp-compatible)
 * @param {Buffer} inputBuffer - Audio source (mp3/wav/m4a/dsb)
 * @returns {Promise<Buffer>} - Buffer hasil ogg/opus
 */
export async function convertToOpus(
  inputBuffer,
  url = 'https://github.com/Rifza123, https://termai.cc'
) {
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
        '-map_metadata',
        '-1',
        '-application',
        'voip',
        '-compression_level',
        '10',
        '-page_duration',
        '20000',
      ])
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(outStream, { end: true });

    outStream.on('data', (c) => chunks.push(c));
  });
}
