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
import path from 'path';

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
  outputPath = null,
  onProgress = null
) {
  return new Promise((resolve, reject) => {
    let command;
    let tempInputFile = null;
    let isTempInput = false;

    if (Buffer.isBuffer(input)) {
      tempInputFile = path.resolve('./toolkit/db', `input_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.bin`);
      fs.writeFileSync(tempInputFile, input);
      input = tempInputFile;
      isTempInput = true;
    }

    if (typeof input === 'string') {
      input = path.resolve(input);
      if (!fs.existsSync(input)) {
        if (isTempInput && tempInputFile && fs.existsSync(tempInputFile)) {
          try { fs.unlinkSync(tempInputFile); } catch (e) {}
        }
        return reject(new Error(`Input file not found: ${input}`));
      }
      const baseName = path.basename(input);
      const nameWithoutExt = baseName.includes('.') ? baseName.slice(0, baseName.lastIndexOf('.')) : baseName;
      outputPath = path.join(path.dirname(input), 'output_' + nameWithoutExt + '.' + format);
      command = ff(input);
    } else {
      return reject(new Error('Invalid input type (Buffer | filepath only)'));
    }

    // 🔥 Batasi CPU ke max 100% (1 CPU core) jika belum diset
    const finalArgs = Array.isArray(args) ? [...args] : [];
    if (!finalArgs.includes('-threads')) {
      finalArgs.push('-threads', '1');
    }

    command.outputOptions(finalArgs);

    if (['png', 'jpg', 'jpeg', 'webp'].includes(format)) {
      command
        .videoCodec(format === 'jpg' ? 'mjpeg' : format)
        .format('image2pipe')
        .outputOptions(['-frames:v', '1']);
    } else {
      command.format(format);
      if (['mp4', 'mov'].includes(format)) {
        command.outputOptions(['-movflags', 'frag_keyframe+empty_moov']);
      }
    }

    if (typeof onProgress === 'function') {
      let totalDurationSec = 0;

      command.on('stderr', (line) => {
        if (!totalDurationSec && line && line.includes('Duration:')) {
          const match = line.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
          if (match) {
            totalDurationSec = parseFloat(match[1]) * 3600 + parseFloat(match[2]) * 60 + parseFloat(match[3]);
          }
        }
      });

      const parseTimemark = (tm) => {
        if (!tm || typeof tm !== 'string') return 0;
        const parts = tm.split(':');
        if (parts.length < 3) return 0;
        return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
      };

      command.on('progress', (p) => {
        if (!p) return;
        let percent = 0;
        if (typeof p.percent === 'number' && !isNaN(p.percent) && p.percent > 0) {
          percent = p.percent;
        } else if (totalDurationSec > 0 && p.timemark) {
          const curSec = parseTimemark(p.timemark);
          percent = Math.min(99.9, (curSec / totalDurationSec) * 100);
        }
        if (percent > 0) {
          onProgress(percent);
        }
      });
    }

    const cleanup = () => {
      if (isTempInput && tempInputFile && fs.existsSync(tempInputFile)) {
        try { fs.unlinkSync(tempInputFile); } catch (e) {}
      }
    };

    const chunks = [];
    const passThrough = new PassThrough();

    passThrough.on('data', (chunk) => chunks.push(chunk));
    passThrough.on('end', () => {
      cleanup();
      resolve(Buffer.concat(chunks));
    });
    passThrough.on('error', (err) => {
      cleanup();
      reject(err);
    });

    command
      .on('error', (err) => {
        cleanup();
        reject(err);
      })
      .pipe(passThrough, { end: true });
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
