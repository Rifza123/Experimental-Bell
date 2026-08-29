const { default: ff } = await 'fluent-ffmpeg'.import();
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn, execSync } from 'child_process';

export async function processMedia(
  input,
  args = [],
  format = 'mp3',
  outputPath = null,
  onProgress = null
) {
  return new Promise((resolve, reject) => {
    let tempInputFile = null;
    let tempOutputFile = null;
    let isTempInput = false;
    let isTempOutput = false;

    if (Buffer.isBuffer(input)) {
      tempInputFile = path.resolve('./toolkit/db', `input_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.tmp`);
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
      if (!outputPath) {
        tempOutputFile = path.resolve('./toolkit/db', `output_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${format}`);
        outputPath = tempOutputFile;
        isTempOutput = true;
      } else {
        outputPath = path.resolve(outputPath);
      }
    } else {
      return reject(new Error('Invalid input type (Buffer | filepath only)'));
    }

    const command = ff(input);

    const finalArgs = Array.isArray(args) ? [...args] : [];
    if (!finalArgs.includes('-threads')) {
      finalArgs.push('-threads', '1');
    }

    command.outputOptions(finalArgs);

    if (['png', 'jpg', 'jpeg', 'webp'].includes(format)) {
      let vcodec = format === 'jpg' || format === 'jpeg' ? 'mjpeg' : format === 'webp' ? 'libwebp' : 'png';
      command
        .videoCodec(vcodec)
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
      if (isTempOutput && tempOutputFile && fs.existsSync(tempOutputFile)) {
        try { fs.unlinkSync(tempOutputFile); } catch (e) {}
      }
    };

    command
      .on('error', (err) => {
        cleanup();
        reject(err);
      })
      .on('end', () => {
        if (isTempOutput) {
          try {
            const resBuf = fs.readFileSync(outputPath);
            cleanup();
            resolve(resBuf);
          } catch (err) {
            cleanup();
            reject(err);
          }
        } else {
          if (isTempInput && tempInputFile && fs.existsSync(tempInputFile)) {
            try { fs.unlinkSync(tempInputFile); } catch (e) {}
          }
          resolve(outputPath);
        }
      })
      .save(outputPath);
  });
}

export async function generateWaveform(
  inputBuffer,
  bars = 64,
  url = 'https://github.com/Rifza123, https://termai.cc'
) {
  return new Promise((resolve, reject) => {
    let tempInputFile = null;
    let tempOutputFile = null;
    let isTempInput = false;

    if (Buffer.isBuffer(inputBuffer)) {
      tempInputFile = path.resolve('./toolkit/db', `wave_in_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.ogg`);
      fs.writeFileSync(tempInputFile, inputBuffer);
      isTempInput = true;
    } else if (typeof inputBuffer === 'string') {
      tempInputFile = path.resolve(inputBuffer);
    } else {
      return reject(new Error('Invalid inputBuffer type'));
    }

    tempOutputFile = path.resolve('./toolkit/db', `wave_out_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.pcm`);

    const cleanup = () => {
      if (isTempInput && tempInputFile && fs.existsSync(tempInputFile)) {
        try { fs.unlinkSync(tempInputFile); } catch (e) {}
      }
      if (tempOutputFile && fs.existsSync(tempOutputFile)) {
        try { fs.unlinkSync(tempOutputFile); } catch (e) {}
      }
    };

    ff(tempInputFile)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('s16le')
      .on('error', (err) => {
        cleanup();
        reject(err);
      })
      .on('end', () => {
        try {
          const rawData = fs.readFileSync(tempOutputFile);
          cleanup();
          const samples = rawData.length / 2;
          if (samples === 0) {
            return resolve(Buffer.alloc(bars).toString('base64'));
          }

          const amplitudes = [];
          for (let i = 0; i < samples; i++) {
            let val = rawData.readInt16LE(i * 2);
            amplitudes.push(Math.abs(val) / 32768);
          }

          let blockSize = Math.max(1, Math.floor(amplitudes.length / bars));
          let avg = [];
          for (let i = 0; i < bars; i++) {
            let block = amplitudes.slice(i * blockSize, (i + 1) * blockSize);
            if (block.length === 0) {
              avg.push(0);
            } else {
              avg.push(block.reduce((a, b) => a + b, 0) / block.length);
            }
          }

          let max = Math.max(...avg, 0);
          let normalized = max > 0 ? avg.map((v) => Math.floor((v / max) * 100)) : avg.map(() => 0);

          let buf = Buffer.from(new Uint8Array(normalized));
          resolve(buf.toString('base64'));
        } catch (e) {
          cleanup();
          reject(e);
        }
      })
      .save(tempOutputFile);
  });
}

export async function convertToOpus(
  inputBuffer,
  url = 'https://github.com/Rifza123, https://termai.cc'
) {
  return new Promise((resolve, reject) => {
    let tempInputFile = null;
    let tempOutputFile = null;
    let isTempInput = false;

    if (Buffer.isBuffer(inputBuffer)) {
      tempInputFile = path.resolve('./toolkit/db', `opus_in_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.mp3`);
      fs.writeFileSync(tempInputFile, inputBuffer);
      isTempInput = true;
    } else if (typeof inputBuffer === 'string') {
      tempInputFile = path.resolve(inputBuffer);
    } else {
      return reject(new Error('Invalid inputBuffer type'));
    }

    tempOutputFile = path.resolve('./toolkit/db', `opus_out_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.ogg`);

    const cleanup = () => {
      if (isTempInput && tempInputFile && fs.existsSync(tempInputFile)) {
        try { fs.unlinkSync(tempInputFile); } catch (e) {}
      }
      if (tempOutputFile && fs.existsSync(tempOutputFile)) {
        try { fs.unlinkSync(tempOutputFile); } catch (e) {}
      }
    };

    ff(tempInputFile)
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
      .on('error', (err) => {
        cleanup();
        reject(err);
      })
      .on('end', () => {
        try {
          const res = fs.readFileSync(tempOutputFile);
          cleanup();
          resolve(res);
        } catch (e) {
          cleanup();
          reject(e);
        }
      })
      .save(tempOutputFile);
  });
}

export async function compressVideo(
  input,
  onProgress = null,
  options = {}
) {
  return new Promise((resolve, reject) => {
    let tempInputFile = null;
    let tempOutputFile = null;
    let isTempInput = false;

    if (Buffer.isBuffer(input)) {
      tempInputFile = path.resolve('./toolkit/db', `cmp_in_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.mp4`);
      fs.writeFileSync(tempInputFile, input);
      input = tempInputFile;
      isTempInput = true;
    } else if (typeof input === 'string') {
      input = path.resolve(input);
      if (!fs.existsSync(input)) {
        return reject(new Error(`Input file not found: ${input}`));
      }
    } else {
      return reject(new Error('Invalid input type (Buffer | filepath only)'));
    }

    tempOutputFile = path.resolve('./toolkit/db', `cmp_out_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.mp4`);

    const cleanup = () => {
      if (isTempInput && tempInputFile && fs.existsSync(tempInputFile)) {
        try { fs.unlinkSync(tempInputFile); } catch (e) {}
      }
      if (tempOutputFile && fs.existsSync(tempOutputFile)) {
        try { fs.unlinkSync(tempOutputFile); } catch (e) {}
      }
    };

    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      input
    ]);

    let durationStr = '';
    ffprobe.stdout.on('data', (d) => durationStr += d.toString());

    ffprobe.on('close', () => {
      const duration = parseFloat(durationStr) || 0;

      const filterChain = [
        'hqdn3d=1.0:1.0:3:3',
        'unsharp=3:3:0.5:3:3:0.0',
        'eq=saturation=1.1',
        "scale='trunc(min(max(iw,ih),1920)*iw/max(iw,ih)/2)*2':'trunc(min(max(iw,ih),1920)*ih/max(iw,ih)/2)*2':flags=lanczos",
        'format=yuv420p'
      ].join(',');

      let command = 'ffmpeg';
      let args = [
        '-v', 'error',
        '-stats',
        '-i', input,
        '-c:v', 'libx265',
        '-crf', '26',
        '-maxrate', '2.5M',
        '-bufsize', '5.0M',
        '-preset', 'fast',
        '-threads', '1',
        '-vf', filterChain,
        '-tag:v', 'hvc1',
        '-c:a', 'aac',
        '-b:a', '64k',
        '-y',
        tempOutputFile
      ];

      let hasCpuLimit = false;
      try {
        execSync('which cpulimit', { stdio: 'ignore' });
        hasCpuLimit = true;
      } catch (e) {}

      if (hasCpuLimit) {
        command = 'cpulimit';
        args = ['-l', '70', '--', 'ffmpeg', ...args];
      } else {
        command = 'nice';
        args = ['-n', '19', 'ffmpeg', ...args];
      }

      const ffmpeg = spawn(command, args);

      ffmpeg.stderr.on('data', (data) => {
        const str = data.toString();
        const timeMatch = str.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
        const speedMatch = str.match(/speed=\s*([\d.]+)x/);

        if (timeMatch && duration > 0) {
          const hours = parseInt(timeMatch[1], 10);
          const minutes = parseInt(timeMatch[2], 10);
          const seconds = parseFloat(timeMatch[3]);
          const processedSeconds = (hours * 3600) + (minutes * 60) + seconds;

          let percentage = ((processedSeconds / duration) * 100).toFixed(1);
          if (parseFloat(percentage) > 100) percentage = '100.0';

          const speed = speedMatch ? parseFloat(speedMatch[1]) : 0;
          let remainingSeconds = 0;
          if (speed > 0) {
            remainingSeconds = Math.max(0, Math.round((duration - processedSeconds) / speed));
          }

          if (typeof onProgress === 'function') {
            onProgress({
              processedSeconds: Math.min(processedSeconds, duration),
              duration,
              percentage: parseFloat(percentage),
              speed: speed.toFixed(2),
              remainingSeconds
            });
          }
        }
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          try {
            const resultBuffer = fs.readFileSync(tempOutputFile);
            const originalSize = fs.statSync(input).size;
            const compressedSize = resultBuffer.length;
            cleanup();
            resolve({
              buffer: resultBuffer,
              originalSize,
              compressedSize,
              duration,
              savedSize: originalSize - compressedSize,
              savedPercent: (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
            });
          } catch (err) {
            cleanup();
            reject(err);
          }
        } else {
          cleanup();
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (err) => {
        cleanup();
        reject(err);
      });
    });

    ffprobe.on('error', (err) => {
      cleanup();
      reject(err);
    });
  });
}

export async function compressImage(
  input,
  options = {}
) {
  return new Promise((resolve, reject) => {
    let tempInputFile = null;
    let tempOutputFile = null;
    let isTempInput = false;

    let ext = options.format;
    if (!ext && Buffer.isBuffer(input)) {
      if (input[0] === 0x89 && input[1] === 0x50 && input[2] === 0x4e && input[3] === 0x47) {
        ext = 'png';
      } else if (input[0] === 0x52 && input[1] === 0x49 && input[2] === 0x46 && input[3] === 0x46) {
        ext = 'webp';
      } else {
        ext = 'jpg';
      }
    }
    ext = ext || 'jpg';

    if (Buffer.isBuffer(input)) {
      tempInputFile = path.resolve('./toolkit/db', `cmpimg_in_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`);
      fs.writeFileSync(tempInputFile, input);
      input = tempInputFile;
      isTempInput = true;
    } else if (typeof input === 'string') {
      input = path.resolve(input);
      if (!fs.existsSync(input)) {
        return reject(new Error(`Input file not found: ${input}`));
      }
    } else {
      return reject(new Error('Invalid input type (Buffer | filepath only)'));
    }

    tempOutputFile = path.resolve('./toolkit/db', `cmpimg_out_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`);

    const cleanup = () => {
      if (isTempInput && tempInputFile && fs.existsSync(tempInputFile)) {
        try { fs.unlinkSync(tempInputFile); } catch (e) {}
      }
      if (tempOutputFile && fs.existsSync(tempOutputFile)) {
        try { fs.unlinkSync(tempOutputFile); } catch (e) {}
      }
    };

    let args = [
      '-v', 'error',
      '-i', input,
      '-vf', "scale='trunc(min(max(iw,ih),1920)*iw/max(iw,ih)/2)*2':'trunc(min(max(iw,ih),1920)*ih/max(iw,ih)/2)*2':flags=lanczos",
      '-map_metadata', '-1'
    ];

    if (ext === 'png') {
      args.push('-c:v', 'png', '-compression_level', '9', '-pred', 'mixed');
    } else if (ext === 'webp') {
      args.push('-c:v', 'libwebp', '-quality', '75');
    } else {
      args.push('-q:v', '3');
    }

    args.push('-y', tempOutputFile);

    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        try {
          const resultBuffer = fs.readFileSync(tempOutputFile);
          const originalSize = fs.statSync(input).size;
          const compressedSize = resultBuffer.length;
          cleanup();
          resolve({
            buffer: resultBuffer,
            originalSize,
            compressedSize,
            savedSize: originalSize - compressedSize,
            savedPercent: (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
          });
        } catch (err) {
          cleanup();
          reject(err);
        }
      } else {
        cleanup();
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', (err) => {
      cleanup();
      reject(err);
    });
  });
}

export async function burikVideo(input, options = {}) {
  return new Promise((resolve, reject) => {
    let width = parseInt(options.width) || 96;
    width = Math.max(16, Math.min(width, 720));
    width = Math.trunc(width / 2) * 2;

    const tmpFileIn = path.join(
      os.tmpdir(),
      `burik_in_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.mp4`
    );
    const tmpFileOut = path.join(
      os.tmpdir(),
      `burik_out_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.mp4`
    );

    let isTempInput = false;
    if (Buffer.isBuffer(input)) {
      fs.writeFileSync(tmpFileIn, input);
      input = tmpFileIn;
      isTempInput = true;
    } else if (typeof input === 'string') {
      input = path.resolve(input);
      if (!fs.existsSync(input)) {
        return reject(new Error(`Input file not found: ${input}`));
      }
    } else {
      return reject(new Error('Invalid input type (Buffer | filepath only)'));
    }

    let isDone = false;
    let timer = null;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (isTempInput && fs.existsSync(tmpFileIn)) {
        try { fs.unlinkSync(tmpFileIn); } catch (e) {}
      }
      if (fs.existsSync(tmpFileOut)) {
        try { fs.unlinkSync(tmpFileOut); } catch (e) {}
      }
    };

    const cmd = ff(input);

    timer = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        try {
          cmd.kill('SIGKILL');
        } catch (e) {}
        cleanup();
        reject(new Error('Render timeout (25s exceeded)'));
      }
    }, 25000);

    cmd
      .renice(19)
      .on('error', (err) => {
        if (!isDone) {
          isDone = true;
          cleanup();
          reject(err);
        }
      })
      .on('end', () => {
        if (!isDone) {
          isDone = true;
          try {
            const buff = fs.readFileSync(tmpFileOut);
            cleanup();
            resolve(buff);
          } catch (e) {
            cleanup();
            reject(e);
          }
        }
      })
      .addOutputOptions([
        '-vf', `fps=15,scale='min(${width},iw)':-2:flags=neighbor,scale=w='trunc(iw*ceil(320/min(iw,ih))/2)*2':h='trunc(ih*ceil(320/min(iw,ih))/2)*2':flags=neighbor,format=yuv420p`,
        '-vcodec', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '36',
        '-threads', '1',
        '-acodec', 'aac',
        '-b:a', '32k',
        '-ar', '22050',
        '-movflags', '+faststart',
      ])
      .toFormat('mp4')
      .save(tmpFileOut);
  });
}
